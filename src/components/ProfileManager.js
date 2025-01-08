import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Alert,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function ProfileManager() {
  const { userProfile, updateUserProfile, currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: userProfile?.name || '',
    companyName: userProfile?.companyName || '',
    phone: userProfile?.phone || '',
    address: userProfile?.address || '',
    bio: userProfile?.bio || '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      setError('');

      const storage = getStorage();
      const storageRef = ref(storage, `profile-images/${currentUser.uid}`);
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);

      await updateUserProfile({ photoURL });
      setSuccess('Profile picture updated successfully!');
    } catch (error) {
      setError('Failed to update profile picture: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await updateUserProfile(formData);
      setSuccess('Profile updated successfully!');
    } catch (error) {
      setError('Failed to update profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Profile Settings
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Avatar
          src={userProfile?.photoURL}
          sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
        />
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="icon-button-file"
          type="file"
          onChange={handleImageUpload}
        />
        <label htmlFor="icon-button-file">
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="span"
            disabled={loading}
          >
            <PhotoCamera />
          </IconButton>
        </label>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Company Name"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={loading}
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              disabled={loading}
              multiline
              rows={3}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
}

export default ProfileManager;
