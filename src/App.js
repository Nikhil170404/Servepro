import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import { SnackbarProvider } from './context/SnackbarContext';
import theme from './theme';
import { Box } from '@mui/material';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ClientDashboard from './pages/dashboard/ClientDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import Services from './pages/services/Services';
import ServiceRequest from './pages/services/ServiceRequest';
import NotFound from './pages/NotFound';

// Components
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Layout from './components/Layout';
import ChatBot from './components/ChatBot';
import Footer from './components/Footer';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <SnackbarProvider>
          <Router>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              minHeight: '100vh'
            }}>
              <Layout>
                <Box component="main" sx={{ flexGrow: 1 }}>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/services" element={<Services />} />

                    {/* Protected Routes */}
                    <Route
                      path="/dashboard"
                      element={
                        <PrivateRoute>
                          <ClientDashboard />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/service-request/:serviceId"
                      element={
                        <PrivateRoute>
                          <ServiceRequest />
                        </PrivateRoute>
                      }
                    />

                    {/* Admin Routes */}
                    <Route
                      path="/admin/dashboard"
                      element={
                        <AdminRoute>
                          <AdminDashboard />
                        </AdminRoute>
                      }
                    />

                    {/* New Routes */}
                    <Route path="/contact" element={<NotFound />} />
                    <Route path="/about" element={<NotFound />} />
                    <Route
                      path="/admin/*"
                      element={
                        <PrivateRoute allowedRoles={['admin']}>
                          <AdminDashboard />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/client/*"
                      element={
                        <PrivateRoute allowedRoles={['client']}>
                          <ClientDashboard />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/chat-support"
                      element={
                        <PrivateRoute allowedRoles={['client', 'admin']}>
                          <ChatBot />
                        </PrivateRoute>
                      }
                    />

                    {/* Catch-all Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Box>
              </Layout>
              <Footer />
            </Box>
          </Router>
        </SnackbarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
