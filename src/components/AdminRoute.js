import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // or a loading spinner
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  return children;
};

export default AdminRoute;
