import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  TextField
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const PaymentVerification = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [verificationNote, setVerificationNote] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, 'payments'),
      where('status', '==', 'pending'),
      orderBy('submittedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const paymentData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPayments(paymentData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleVerification = async (approved) => {
    if (!selectedPayment) return;

    setProcessing(true);
    try {
      // Update payment status
      await updateDoc(doc(db, 'payments', selectedPayment.id), {
        status: approved ? 'approved' : 'rejected',
        verifiedAt: new Date().toISOString(),
        verificationNote: verificationNote
      });

      // Update service status
      await updateDoc(doc(db, 'services', selectedPayment.serviceId), {
        paymentStatus: approved ? 'approved' : 'rejected',
        lastUpdated: new Date().toISOString()
      });

      setOpenDialog(false);
      setVerificationNote('');
      setSelectedPayment(null);
    } catch (error) {
      console.error('Verification error:', error);
      alert('Failed to update payment status');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Payment Verification ({payments.length} pending)
      </Typography>

      <Grid container spacing={3}>
        {payments.map((payment) => (
          <Grid item xs={12} md={6} key={payment.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">
                    Amount: ₹{payment.amount}
                  </Typography>
                  <Chip label="Pending Verification" color="warning" size="small" />
                </Box>

                <Typography variant="body2" gutterBottom>
                  Transaction ID: {payment.transactionId}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Submitted: {new Date(payment.submittedAt.toDate()).toLocaleString()}
                </Typography>

                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<VisibilityIcon />}
                    onClick={() => window.open(payment.screenshotUrl, '_blank')}
                  >
                    View Screenshot
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setSelectedPayment(payment);
                      setOpenDialog(true);
                    }}
                  >
                    Verify Payment
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={openDialog} 
        onClose={() => !processing && setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Verify Payment</DialogTitle>
        <DialogContent>
          {selectedPayment && (
            <>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Transaction Details:
                </Typography>
                <Typography variant="body2">
                  Amount: ₹{selectedPayment.amount}
                </Typography>
                <Typography variant="body2">
                  Transaction ID: {selectedPayment.transactionId}
                </Typography>
                <Typography variant="body2">
                  Submitted: {new Date(selectedPayment.submittedAt.toDate()).toLocaleString()}
                </Typography>
              </Box>

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Verification Note"
                value={verificationNote}
                onChange={(e) => setVerificationNote(e.target.value)}
                margin="normal"
              />

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={() => window.open(selectedPayment.screenshotUrl, '_blank')}
                >
                  View Payment Screenshot
                </Button>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDialog(false)} 
            disabled={processing}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleVerification(false)}
            color="error"
            startIcon={<CancelIcon />}
            disabled={processing}
          >
            Reject
          </Button>
          <Button
            onClick={() => handleVerification(true)}
            color="success"
            variant="contained"
            startIcon={<CheckCircleIcon />}
            disabled={processing}
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      {payments.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          No pending payments to verify
        </Alert>
      )}
    </Box>
  );
};

export default PaymentVerification;
