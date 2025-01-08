import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Chat as ChatIcon,
  Help as HelpIcon,
} from '@mui/icons-material';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

const SupportDialog = ({ open, onClose }) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!message || !category) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await addDoc(collection(db, 'support_tickets'), {
        userId: user.uid,
        userEmail: user.email,
        message,
        category,
        status: 'open',
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
      setMessage('');
      setCategory('');
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError('Failed to submit support ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const supportCategories = [
    { id: 'technical', label: 'Technical Support', icon: <HelpIcon /> },
    { id: 'billing', label: 'Billing Support', icon: <EmailIcon /> },
    { id: 'general', label: 'General Inquiry', icon: <ChatIcon /> },
    { id: 'urgent', label: 'Urgent Help', icon: <PhoneIcon /> },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Contact Support</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Support ticket submitted successfully!
          </Alert>
        )}

        <Typography variant="subtitle1" gutterBottom>
          Select Support Category
        </Typography>
        <List>
          {supportCategories.map((cat) => (
            <ListItem
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              selected={category === cat.id}
              component="div"
              sx={{
                border: 1,
                borderColor: category === cat.id ? 'primary.main' : 'divider',
                borderRadius: 1,
                mb: 1,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              <ListItemIcon>{cat.icon}</ListItemIcon>
              <ListItemText primary={cat.label} />
            </ListItem>
          ))}
        </List>

        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="How can we help you?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loading}
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Our support team typically responds within 24 hours.
            For urgent matters, please call our support line at +1-800-SUPPORT.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SupportDialog;
