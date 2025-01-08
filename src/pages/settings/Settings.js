import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useSnackbar } from '../../context/SnackbarContext';

const Settings = () => {
  const { updatePassword } = useAuth();
  const { showSnackbar } = useSnackbar();
  
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    darkMode: false,
    soundEnabled: true
  });

  const [passwordDialog, setPasswordDialog] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [error, setError] = useState('');

  const handleToggle = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    showSnackbar('Setting updated successfully', 'success');
  };

  const handlePasswordChange = async () => {
    if (passwords.new !== passwords.confirm) {
      setError('New passwords do not match');
      return;
    }

    try {
      await updatePassword(passwords.new);
      setPasswordDialog(false);
      setPasswords({ current: '', new: '', confirm: '' });
      showSnackbar('Password updated successfully', 'success');
    } catch (err) {
      setError('Failed to update password: ' + err.message);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>

        <List>
          <ListItem>
            <ListItemText 
              primary="Email Notifications"
              secondary="Receive email notifications about your projects"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={settings.emailNotifications}
                onChange={() => handleToggle('emailNotifications')}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />

          <ListItem>
            <ListItemText
              primary="Push Notifications"
              secondary="Receive push notifications in your browser"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={settings.pushNotifications}
                onChange={() => handleToggle('pushNotifications')}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />

          <ListItem>
            <ListItemText
              primary="Dark Mode"
              secondary="Toggle dark mode theme"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={settings.darkMode}
                onChange={() => handleToggle('darkMode')}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />

          <ListItem>
            <ListItemText
              primary="Sound Effects"
              secondary="Enable sound effects for notifications"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={settings.soundEnabled}
                onChange={() => handleToggle('soundEnabled')}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Security
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setPasswordDialog(true)}
          >
            Change Password
          </Button>
        </Box>
      </Paper>

      <Dialog open={passwordDialog} onClose={() => setPasswordDialog(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Current Password"
            type="password"
            fullWidth
            value={passwords.current}
            onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
          />
          <TextField
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            value={passwords.new}
            onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
          />
          <TextField
            margin="dense"
            label="Confirm New Password"
            type="password"
            fullWidth
            value={passwords.confirm}
            onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialog(false)}>Cancel</Button>
          <Button onClick={handlePasswordChange} color="primary">
            Update Password
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Settings;
