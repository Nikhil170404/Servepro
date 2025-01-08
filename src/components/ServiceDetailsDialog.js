import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
  useMediaQuery,
  Stepper,
  Step,
  StepLabel,
  Grid,
  CircularProgress,
  IconButton
} from '@mui/material';
import {
  Check as CheckIcon,
  Payment as PaymentIcon,
  Upload as UploadIcon,
  AccountBalance as AccountBalanceIcon,
  NavigateNext as NextIcon,
  NavigateBefore as BackIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../firebase/config';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const steps = ['Service Details', 'Payment Information', 'Confirmation'];

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

function ServiceDetailsDialog({ 
  open, 
  onClose, 
  service, 
  onRequest,
  defaultCurrency = 'usd'
}) {
  const [tabValue, setTabValue] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState('standard');
  const [currency, setCurrency] = useState(defaultCurrency);
  const [requestDetails, setRequestDetails] = useState('');
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuth();

  // Form states
  const [requirements, setRequirements] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);

  const paymentDetails = {
    upiId: "servepro.payments@okaxis",
    accountNumber: "1234567890",
    ifscCode: "AXIS0000123",
    accountName: "ServePro Business Account",
    contactNumber: "+91 9876543210"
  };

  const handleCurrencyChange = (event, newCurrency) => {
    if (newCurrency !== null) {
      setCurrency(newCurrency);
    }
  };

  const formatPrice = (amount) => {
    if (currency === 'usd') {
      return `$${amount.toLocaleString()}`;
    } else {
      return `₹${amount.toLocaleString()}`;
    }
  };

  const handleSubmit = () => {
    if (!requestDetails.trim()) {
      setError('Please provide request details');
      return;
    }
    onRequest(service, selectedPlan, requestDetails);
  };

  const handleNext = () => {
    if (activeStep === 0 && !requirements.trim()) {
      setError('Please provide your requirements');
      return;
    }
    if (activeStep === 1 && (!transactionId.trim() || !paymentScreenshot)) {
      setError('Please provide both transaction ID and payment screenshot');
      return;
    }
    setError(null);
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError(null);
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

  const handlePaymentSubmit = async () => {
    setLoading(true);
    try {
      // Upload payment screenshot
      const screenshotRef = ref(storage, `payment-proofs/${service.id}/${user.uid}/${Date.now()}`);
      await uploadBytes(screenshotRef, paymentScreenshot);
      const screenshotUrl = await getDownloadURL(screenshotRef);

      // Create service request
      const serviceRequest = {
        serviceId: service.id,
        userId: user.uid,
        requirements: requirements,
        status: 'pending',
        createdAt: serverTimestamp(),
        paymentStatus: 'pending_verification',
        payment: {
          amount: service.price,
          transactionId: transactionId,
          screenshotUrl: screenshotUrl,
          submittedAt: serverTimestamp()
        }
      };

      // Add to Firestore
      const docRef = await addDoc(collection(db, 'serviceRequests'), serviceRequest);

      // Create payment record
      await addDoc(collection(db, 'payments'), {
        serviceRequestId: docRef.id,
        serviceId: service.id,
        userId: user.uid,
        amount: service.price,
        transactionId: transactionId,
        screenshotUrl: screenshotUrl,
        status: 'pending_verification',
        submittedAt: serverTimestamp()
      });

      // Reset form and close dialog
      setRequirements('');
      setTransactionId('');
      setPaymentScreenshot(null);
      setActiveStep(0);
      onClose();
      alert('Service request submitted successfully! Waiting for payment verification.');
    } catch (error) {
      console.error('Submission error:', error);
      setError('Failed to submit service request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Service Details
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {service.description}
            </Typography>
            <TextField
              fullWidth
              label="Your Requirements"
              multiline
              rows={4}
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              required
              error={error && !requirements.trim()}
              helperText={error && !requirements.trim() ? 'Requirements are required' : ''}
            />
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Payment Details
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Please make the payment using any of the methods below and provide the details.
              Amount to pay: ₹{service.price}
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
              required
              error={error && !transactionId.trim()}
              helperText={error && !transactionId.trim() ? 'Transaction ID is required' : ''}
              sx={{ mb: 2 }}
            />

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
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Confirm Your Request
            </Typography>
            <Typography variant="body1" paragraph>
              Please review your service request details:
            </Typography>
            <Typography variant="body2" gutterBottom>
              Service: {service.title}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Amount: ₹{service.price}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Transaction ID: {transactionId}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Requirements: {requirements}
            </Typography>
            {paymentScreenshot && (
              <Typography variant="body2" color="primary">
                Payment screenshot uploaded
              </Typography>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  if (!service) return null;

  return (
    <Dialog 
      open={open} 
      onClose={!loading ? onClose : undefined}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <service.icon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h6">
            {service.title}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Tabs 
          value={tabValue} 
          onChange={(e, newValue) => setTabValue(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Overview" />
          <Tab label="Features" />
          <Tab label="Request Service" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Typography paragraph>
            {service.longDescription}
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Technologies Used
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {service.technologies.map((tech) => (
                <Button
                  key={tech}
                  variant="outlined"
                  size="small"
                  sx={{ textTransform: 'none' }}
                >
                  {tech}
                </Button>
              ))}
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Market Analysis
            </Typography>
            <Typography color="textSecondary">
              {service.marketComparison}
            </Typography>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 3 }}>
            <ToggleButtonGroup
              value={currency}
              exclusive
              onChange={handleCurrencyChange}
              size="small"
            >
              <ToggleButton value="usd">USD</ToggleButton>
              <ToggleButton value="inr">INR</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            {Object.keys(service.price[currency]).map((plan) => (
              <Button
                key={plan}
                variant={selectedPlan === plan ? 'contained' : 'outlined'}
                onClick={() => setSelectedPlan(plan)}
                sx={{ 
                  textTransform: 'capitalize',
                  minWidth: isMobile ? '100%' : 'auto'
                }}
              >
                {plan} - {formatPrice(service.price[currency][plan])}
              </Button>
            ))}
          </Box>

          <Typography variant="subtitle1" gutterBottom>
            {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Plan Features:
          </Typography>
          <List>
            {service.features[selectedPlan].map((feature, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <CheckIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={feature} />
              </ListItem>
            ))}
          </List>

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Delivery Time
            </Typography>
            <Typography>
              {service.deliveryTime}
            </Typography>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Stepper activeStep={activeStep} sx={{ py: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {renderStepContent(activeStep)}
        </TabPanel>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Close
        </Button>
        {tabValue === 2 && activeStep > 0 && (
          <Button onClick={handleBack} disabled={loading}>
            <BackIcon /> Back
          </Button>
        )}
        {tabValue === 2 && activeStep === steps.length - 1 ? (
          <Button
            onClick={handlePaymentSubmit}
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <PaymentIcon />}
          >
            Submit Request
          </Button>
        ) : tabValue === 2 && (
          <Button onClick={handleNext} variant="contained" disabled={loading}>
            Next <NextIcon />
          </Button>
        )}
        {tabValue === 2 && activeStep === 0 && (
          <Button 
            variant="contained" 
            onClick={handleSubmit}
          >
            Submit Request
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default ServiceDetailsDialog;
