import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  Payment as PaymentIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

const PaymentsDialog = ({ open, onClose }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const paymentsRef = collection(db, 'payments');
      const q = query(
        paymentsRef,
        where('userId', '==', user.uid),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const paymentsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate()
      }));
      
      setPayments(paymentsList);
    } catch (err) {
      setError('Failed to load payment history');
    } finally {
      setLoading(false);
    }
  }, [user.uid]);

  useEffect(() => {
    if (open) {
      fetchPayments();
    }
  }, [open, fetchPayments]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const TabPanel = ({ children, value, index }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`payment-tabpanel-${index}`}
      aria-labelledby={`payment-tab-${index}`}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      aria-labelledby="payments-dialog-title"
    >
      <DialogTitle id="payments-dialog-title">
        <Box display="flex" alignItems="center">
          <PaymentIcon sx={{ mr: 1 }} />
          Payments & Billing
        </Box>
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
          aria-label="payment tabs"
        >
          <Tab 
            icon={<HistoryIcon />} 
            label="Payment History"
            id="payment-tab-0"
            aria-controls="payment-tabpanel-0"
          />
          <Tab 
            icon={<ReceiptIcon />} 
            label="Invoices"
            id="payment-tab-1"
            aria-controls="payment-tabpanel-1"
          />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : payments.length > 0 ? (
            <TableContainer component={Paper}>
              <Table aria-label="payments history table">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Service</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Invoice</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        {payment.date?.toLocaleDateString()}
                      </TableCell>
                      <TableCell>{payment.service}</TableCell>
                      <TableCell>{payment.amount}</TableCell>
                      <TableCell>
                        <Chip
                          label={payment.status}
                          color={getStatusColor(payment.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          startIcon={<ReceiptIcon />}
                          onClick={() => window.open(payment.invoiceUrl, '_blank')}
                          aria-label={`View invoice for ${payment.service}`}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1" color="text.secondary" align="center">
              No payment history found
            </Typography>
          )}
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Typography variant="body1" color="text.secondary" align="center">
            Your invoices will appear here once services are purchased
          </Typography>
        </TabPanel>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentsDialog;
