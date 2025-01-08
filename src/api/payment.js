const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { db } = require('../firebase/config');
const { doc, updateDoc, getDoc } = require('firebase/firestore');

// Create a Stripe checkout session
exports.createCheckoutSession = async (req, res) => {
  try {
    const { serviceId, paymentIntentId, amount, serviceName } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: serviceName,
              description: `Payment for service: ${serviceName}`,
            },
            unit_amount: amount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.REACT_APP_BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.REACT_APP_BASE_URL}/payment/cancel`,
      metadata: {
        serviceId,
        paymentIntentId,
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};

// Handle successful payment webhook
exports.handlePaymentWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { serviceId, paymentIntentId } = session.metadata;

    try {
      // Update service payment status
      const serviceRef = doc(db, 'services', serviceId);
      await updateDoc(serviceRef, {
        paymentStatus: 'paid',
        paidAt: new Date().toISOString(),
        transactionId: session.payment_intent
      });

      // Update payment intent status
      const paymentIntentRef = doc(db, 'paymentIntents', paymentIntentId);
      await updateDoc(paymentIntentRef, {
        status: 'completed',
        stripePaymentIntentId: session.payment_intent,
        completedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating payment status:', error);
      return res.status(500).send('Error updating payment status');
    }
  }

  res.json({ received: true });
};

// Generate receipt
exports.generateReceipt = async (req, res) => {
  try {
    const { serviceId, userId, amount, date } = req.body;

    // Get service details
    const serviceRef = doc(db, 'services', serviceId);
    const serviceDoc = await getDoc(serviceRef);
    const serviceData = serviceDoc.data();

    // Create PDF receipt
    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument();

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=receipt-${serviceId}.pdf`
    );

    // Pipe the PDF document to the response
    doc.pipe(res);

    // Add content to the PDF
    doc
      .fontSize(20)
      .text('Receipt', { align: 'center' })
      .moveDown()
      .fontSize(12)
      .text(`Receipt Date: ${new Date(date).toLocaleDateString()}`)
      .text(`Service: ${serviceData.title}`)
      .text(`Amount: $${amount.toFixed(2)}`)
      .text(`Transaction ID: ${serviceData.transactionId || 'N/A'}`)
      .moveDown()
      .text('Thank you for your business!', { align: 'center' });

    // Finalize the PDF
    doc.end();
  } catch (error) {
    console.error('Error generating receipt:', error);
    res.status(500).json({ error: 'Failed to generate receipt' });
  }
};

// Get payment status
exports.getPaymentStatus = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const serviceRef = doc(db, 'services', serviceId);
    const serviceDoc = await getDoc(serviceRef);

    if (!serviceDoc.exists()) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const serviceData = serviceDoc.data();
    res.json({
      paymentStatus: serviceData.paymentStatus,
      paidAt: serviceData.paidAt,
      transactionId: serviceData.transactionId
    });
  } catch (error) {
    console.error('Error getting payment status:', error);
    res.status(500).json({ error: 'Failed to get payment status' });
  }
};
