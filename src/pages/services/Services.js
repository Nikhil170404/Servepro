import React from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton
} from '@mui/material';
import {
  Check as CheckIcon,
  Schedule as ScheduleIcon,
  Payment as PaymentIcon,
  Web as WebIcon,
  MobileScreenShare as MobileIcon,
  Storage as DatabaseIcon,
  Security as SecurityIcon,
  ShoppingCart as ShoppingCartIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const services = [
  {
    id: 'web-basic',
    title: 'Basic Website',
    icon: <WebIcon fontSize="large" />,
    description: 'Simple, responsive website perfect for small businesses',
    features: [
      'Responsive Design',
      '5 Pages',
      'Contact Form',
      'Basic SEO',
      'Social Media Integration'
    ],
    timeframe: '2-3 weeks',
    priceIndia: 14999,
    priceInternational: 499,
    category: 'web'
  },
  {
    id: 'web-ecommerce',
    title: 'E-commerce Website',
    icon: <ShoppingCartIcon fontSize="large" />,
    description: 'Full-featured online store with payment integration',
    features: [
      'Product Management',
      'Shopping Cart',
      'Payment Gateway',
      'Order Management',
      'Customer Accounts'
    ],
    timeframe: '4-6 weeks',
    priceIndia: 49999,
    priceInternational: 1499,
    category: 'web'
  },
  {
    id: 'mobile-basic',
    title: 'Mobile App Basic',
    icon: <MobileIcon fontSize="large" />,
    description: 'Native mobile app for Android/iOS',
    features: [
      'User Authentication',
      'Basic CRUD Operations',
      'Push Notifications',
      'Offline Support',
      'Analytics Integration'
    ],
    timeframe: '6-8 weeks',
    priceIndia: 99999,
    priceInternational: 2999,
    category: 'mobile'
  },
  {
    id: 'database-setup',
    title: 'Database Setup & Migration',
    icon: <DatabaseIcon fontSize="large" />,
    description: 'Professional database design and migration services',
    features: [
      'Schema Design',
      'Data Migration',
      'Performance Optimization',
      'Backup Setup',
      'Security Configuration'
    ],
    timeframe: '1-2 weeks',
    priceIndia: 24999,
    priceInternational: 799,
    category: 'database'
  },
  {
    id: 'security-audit',
    title: 'Security Audit',
    icon: <SecurityIcon fontSize="large" />,
    description: 'Comprehensive security assessment and improvements',
    features: [
      'Vulnerability Assessment',
      'Code Review',
      'Security Testing',
      'Compliance Check',
      'Security Report'
    ],
    timeframe: '1-2 weeks',
    priceIndia: 34999,
    priceInternational: 999,
    category: 'security'
  }
];

const Services = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleRequestService = (serviceId) => {
    if (!user) {
      navigate('/login', { state: { message: 'Please login to request services', severity: 'info' } });
      return;
    }
    navigate(`/service-request/${serviceId}`);
  };

  const formatPrice = (price, currency) => {
    return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
      style: 'currency',
      currency: currency === 'INR' ? 'INR' : 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{ mr: 2 }}
          aria-label="back"
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Our Services
        </Typography>
      </Box>
      <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary" sx={{ mb: 4 }}>
        Professional services at competitive prices
      </Typography>

      <Grid container spacing={3}>
        {services.map((service) => (
          <Grid item xs={12} md={6} key={service.id}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {service.icon}
                  <Typography variant="h6" component="h2" sx={{ ml: 2 }}>
                    {service.title}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {service.description}
                </Typography>

                <List dense>
                  {service.features.map((feature, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>

                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <ScheduleIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      Timeframe: {service.timeframe}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PaymentIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      India: {formatPrice(service.priceIndia, 'INR')} |{' '}
                      International: {formatPrice(service.priceInternational, 'USD')}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>

              <CardActions>
                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={() => handleRequestService(service.id)}
                >
                  Request Service
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Services;
