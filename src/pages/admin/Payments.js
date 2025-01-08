import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';

const statusColors = {
  pending: 'warning',
  completed: 'success',
  failed: 'error',
};

function Payments() {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, 'payments'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const paymentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      setPayments(paymentsData);
    });

    return () => unsubscribe();
  }, []);

  const handleView = (payment) => {
    setSelectedPayment(payment);
    setViewDialogOpen(true);
  };

  const handleDownloadReceipt = (payment) => {
    // Implement receipt download logic
    console.log('Downloading receipt for payment:', payment.id);
  };

  const getTotalRevenue = () => {
    return payments
      .filter(payment => payment.status === 'completed')
      .reduce((sum, payment) => sum + (payment.amount || 0), 0);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Payments
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" color="primary">
          Total Revenue: ${getTotalRevenue().toFixed(2)}
        </Typography>
      </Paper>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Transaction ID</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.transactionId || payment.id}</TableCell>
                  <TableCell>{payment.serviceName}</TableCell>
                  <TableCell>{payment.userEmail}</TableCell>
                  <TableCell>${payment.amount?.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={payment.status} 
                      color={statusColors[payment.status] || 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    {payment.createdAt?.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleView(payment)} size="small">
                      <ViewIcon />
                    </IconButton>
                    {payment.status === 'completed' && (
                      <IconButton 
                        onClick={() => handleDownloadReceipt(payment)}
                        size="small"
                        color="primary"
                      >
                        <ReceiptIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)}>
        <DialogTitle>Payment Details</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2">Transaction ID</Typography>
          <Typography paragraph>
            {selectedPayment?.transactionId || selectedPayment?.id}
          </Typography>
          
          <Typography variant="subtitle2">Service</Typography>
          <Typography paragraph>{selectedPayment?.serviceName}</Typography>
          
          <Typography variant="subtitle2">Client</Typography>
          <Typography paragraph>{selectedPayment?.userEmail}</Typography>
          
          <Typography variant="subtitle2">Amount</Typography>
          <Typography paragraph>
            ${selectedPayment?.amount?.toFixed(2)}
          </Typography>
          
          <Typography variant="subtitle2">Status</Typography>
          <Chip 
            label={selectedPayment?.status} 
            color={statusColors[selectedPayment?.status] || 'default'}
          />
          
          <Typography variant="subtitle2" sx={{ mt: 2 }}>Payment Method</Typography>
          <Typography paragraph>{selectedPayment?.paymentMethod}</Typography>
          
          {selectedPayment?.notes && (
            <>
              <Typography variant="subtitle2">Notes</Typography>
              <Typography>{selectedPayment.notes}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          {selectedPayment?.status === 'completed' && (
            <Button 
              onClick={() => handleDownloadReceipt(selectedPayment)}
              startIcon={<ReceiptIcon />}
            >
              Download Receipt
            </Button>
          )}
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Payments;
