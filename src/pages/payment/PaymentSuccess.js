import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Receipt as ReceiptIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const PaymentSuccess = () => {
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const sessionId = searchParams.get('session_id');
        if (!sessionId) {
          throw new Error('No session ID found');
        }

        // Verify payment with your backend
        const response = await fetch(`/api/verify-payment/${sessionId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Payment verification failed');
        }

        setPaymentDetails(data);
      } catch (error) {
        console.error('Payment verification error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  const handleDownloadReceipt = async () => {
    if (!paymentDetails) return;

    try {
      const response = await fetch('/api/generate-receipt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: paymentDetails.serviceId,
          userId: user.uid,
          amount: paymentDetails.amount,
          date: new Date().toISOString()
        }),
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${paymentDetails.serviceId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Receipt download error:', error);
      setError('Failed to download receipt');
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
        }}
      >
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Verifying payment...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mt: 4,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : (
          <>
            <CheckCircleIcon
              color="success"
              sx={{ fontSize: 64, margin: '0 auto' }}
            />
            <Typography variant="h4" gutterBottom>
              Payment Successful!
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Thank you for your payment. Your service request has been confirmed.
            </Typography>
            {paymentDetails && (
              <Box sx={{ mt: 2, mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Transaction ID: {paymentDetails.transactionId}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Amount Paid: ${paymentDetails.amount.toFixed(2)}
                </Typography>
                <Typography variant="subtitle1">
                  Date: {new Date().toLocaleDateString()}
                </Typography>
              </Box>
            )}
          </>
        )}

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
          <Button
            variant="contained"
            startIcon={<ReceiptIcon />}
            onClick={handleDownloadReceipt}
            disabled={!paymentDetails}
          >
            Download Receipt
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default PaymentSuccess;
