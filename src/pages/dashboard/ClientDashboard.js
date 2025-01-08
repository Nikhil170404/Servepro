import React from 'react';
import { Box, Grid, Paper, Typography, Button, Card, CardContent } from '@mui/material';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          {/* Welcome Card */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <Typography variant="h4" gutterBottom>
                Welcome back, {user?.displayName || 'User'}!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage your services and track your requests from your personalized dashboard.
              </Typography>
            </Paper>
          </Grid>

          {/* Quick Stats */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Active Services
                </Typography>
                <Typography variant="h4">3</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Pending Requests
                </Typography>
                <Typography variant="h4">2</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Completed Services
                </Typography>
                <Typography variant="h4">8</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Spent
                </Typography>
                <Typography variant="h4">₹12,500</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              {/* Add your recent activity list here */}
            </Paper>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => navigate('/services')}
                >
                  Browse Services
                </Button>
                <Button 
                  variant="outlined" 
                  color="primary"
                  onClick={() => navigate('/support')}
                >
                  Contact Support
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default ClientDashboard;