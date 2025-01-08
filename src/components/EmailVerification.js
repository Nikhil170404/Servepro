import React, { useState } from 'react';
import { Alert, Button, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { sendEmailVerification } from 'firebase/auth';

const EmailVerification = () => {
  const { currentUser } = useAuth();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (!currentUser || currentUser.emailVerified) {
    return null;
  }

  const handleResendVerification = async () => {
    try {
      await sendEmailVerification(currentUser);
      setMessage('Verification email sent! Please check your inbox.');
      setError('');
    } catch (error) {
      setError('Failed to send verification email. Please try again later.');
      setMessage('');
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Alert 
        severity="warning" 
        action={
          <Button 
            color="inherit" 
            size="small" 
            onClick={handleResendVerification}
          >
            Resend Email
          </Button>
        }
      >
        Please verify your email address to access all features.
      </Alert>
      
      {message && <Alert severity="success" sx={{ mt: 1 }}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
    </Box>
  );
};

export default EmailVerification;
