import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Grid
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  Payment as PaymentIcon,
  Info as InfoIcon,
  Upload as UploadIcon,
  AccountBalance as AccountBalanceIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../firebase/config';
import { doc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ServiceDetailsDialog from './ServiceDetailsDialog';

const ServiceCard = ({ service }) => {
  const [openDetails, setOpenDetails] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const paymentDetails = {
    upiId: "service.payment@okaxis",
    accountNumber: "1234567890",
    ifscCode: "AXIS0000123",
    accountName: "Service Payment Account",
    contactNumber: "+91 9876543210"
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setPaymentScreenshot(file);
      setError(null);
    } else {
      setError('Please upload a valid image file');
    }
  };

  const handlePaymentSubmission = async () => {
    if (!transactionId.trim() || !paymentScreenshot) {
      setError('Please provide both transaction ID and payment screenshot');
      return;
    }

    setLoading(true);
    try {
      // Upload screenshot to Firebase Storage
      const screenshotRef = ref(storage, `payment-proofs/${service.id}/${user.uid}/${Date.now()}`);
      await uploadBytes(screenshotRef, paymentScreenshot);
      const screenshotUrl = await getDownloadURL(screenshotRef);

      // Create payment record
      const paymentRecord = {
        serviceId: service.id,
        userId: user.uid,
        transactionId: transactionId,
        amount: service.price,
        screenshotUrl: screenshotUrl,
        status: 'pending',
        submittedAt: serverTimestamp(),
        paymentMethod: 'manual'
      };

      // Add payment record to Firestore
      await addDoc(collection(db, 'payments'), paymentRecord);

      // Update service status
      await updateDoc(doc(db, 'services', service.id), {
        paymentStatus: 'pending_verification',
        lastUpdated: serverTimestamp()
      });

      setOpenPayment(false);
      alert('Payment details submitted successfully. Waiting for admin verification.');
    } catch (error) {
      console.error('Payment submission error:', error);
      setError('Failed to submit payment details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="div">
            {service.title}
          </Typography>
          <Tooltip title="View Details">
            <IconButton size="small" onClick={() => setOpenDetails(true)}>
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {service.description}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Chip
            label={service.status}
            color={service.status === 'pending' ? 'warning' : 'success'}
            size="small"
          />
          <Typography variant="h6" color="primary">
            ₹{service.price}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<PaymentIcon />}
          onClick={() => setOpenPayment(true)}
          disabled={service.paymentStatus === 'pending_verification' || service.paymentStatus === 'approved'}
        >
          {service.paymentStatus === 'pending_verification' 
            ? 'Payment Verification Pending' 
            : service.paymentStatus === 'approved'
            ? 'Payment Approved'
            : 'Make Payment'}
        </Button>
      </CardActions>

      <ServiceDetailsDialog
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        service={service}
      />

      <Dialog 
        open={openPayment} 
        onClose={() => setOpenPayment(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Payment Details</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Please make the payment using any of the methods below and submit the details for verification.
          </Alert>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                <AccountBalanceIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Bank Transfer Details:
              </Typography>
              <Typography variant="body2">Account Number: {paymentDetails.accountNumber}</Typography>
              <Typography variant="body2">IFSC Code: {paymentDetails.ifscCode}</Typography>
              <Typography variant="body2">Account Name: {paymentDetails.accountName}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                <PaymentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                UPI Details:
              </Typography>
              <Typography variant="body2">UPI ID: {paymentDetails.upiId}</Typography>
              <Typography variant="body2">Contact: {paymentDetails.contactNumber}</Typography>
            </Grid>
          </Grid>

          <TextField
            fullWidth
            label="Transaction ID"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            margin="normal"
            required
          />

          <Box sx={{ mt: 2 }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="payment-screenshot"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="payment-screenshot">
              <Button
                variant="outlined"
                component="span"
                startIcon={<UploadIcon />}
                fullWidth
              >
                Upload Payment Screenshot
              </Button>
            </label>
            {paymentScreenshot && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected file: {paymentScreenshot.name}
              </Typography>
            )}
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPayment(false)}>Cancel</Button>
          <Button
            onClick={handlePaymentSubmission}
            variant="contained"
            disabled={loading || !transactionId || !paymentScreenshot}
            startIcon={loading ? <CircularProgress size={20} /> : <PaymentIcon />}
          >
            Submit Payment Details
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default ServiceCard;
