import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const steps = ['Service Selection', 'Requirements', 'Review & Submit'];

const ServiceRequest = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [service, setService] = useState(null);
  const [formData, setFormData] = useState({
    requirements: '',
    timeline: '',
    budget: '',
    additionalInfo: ''
  });

  useEffect(() => {
    const fetchService = async () => {
      try {
        // In a real app, fetch from Firestore. For now, using the static data
        const services = {
          'web-basic': {
            title: 'Basic Website',
            priceIndia: 14999,
            priceInternational: 499
          },
          'web-ecommerce': {
            title: 'E-commerce Website',
            priceIndia: 49999,
            priceInternational: 1499
          },
          // Add other services...
        };

        if (services[serviceId]) {
          setService(services[serviceId]);
        } else {
          setError('Service not found');
        }
      } catch (err) {
        setError('Error fetching service details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const serviceRequest = {
        userId: user.uid,
        userEmail: user.email,
        serviceId,
        ...formData,
        status: 'pending',
        createdAt: serverTimestamp(),
        progress: 0
      };

      await addDoc(collection(db, 'serviceRequests'), serviceRequest);
      navigate('/dashboard', { 
        state: { 
          message: 'Service request submitted successfully! Our team will review it shortly.',
          severity: 'success'
        }
      });
    } catch (err) {
      setError('Failed to submit service request. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Selected Service: {service.title}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Price: ₹{service.priceIndia} (India) / ${service.priceInternational} (International)
            </Typography>
          </Box>
        );
      case 1:
        return (
          <Box>
            <TextField
              fullWidth
              multiline
              rows={4}
              name="requirements"
              label="Project Requirements"
              value={formData.requirements}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              name="timeline"
              label="Preferred Timeline"
              value={formData.timeline}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              name="budget"
              label="Budget Range"
              value={formData.budget}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              name="additionalInfo"
              label="Additional Information"
              value={formData.additionalInfo}
              onChange={handleChange}
              margin="normal"
            />
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Your Request
            </Typography>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Service: {service.title}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Requirements:
                </Typography>
                <Typography variant="body2" paragraph>
                  {formData.requirements}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Timeline:
                </Typography>
                <Typography variant="body2" paragraph>
                  {formData.timeline}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Budget Range:
                </Typography>
                <Typography variant="body2" paragraph>
                  {formData.budget}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Additional Information:
                </Typography>
                <Typography variant="body2">
                  {formData.additionalInfo}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom align="center">
          Service Request
        </Typography>

        <Stepper activeStep={activeStep} sx={{ py: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 4 }}>
          {getStepContent(activeStep)}
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Submit Request'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ServiceRequest;
