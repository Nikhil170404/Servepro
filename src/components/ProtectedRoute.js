import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    // Not logged in - redirect to appropriate login page
    return <Navigate to={`/${requiredRole}/login`} />;
  }

  if (userRole !== requiredRole) {
    // Wrong role - redirect to appropriate dashboard or home
    if (userRole === 'admin') {
      return <Navigate to="/admin/dashboard" />;
    } else if (userRole === 'client') {
      return <Navigate to="/client/dashboard" />;
    } else {
      return <Navigate to="/" />;
    }
  }

  return children;
};

export default ProtectedRoute;
