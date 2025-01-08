import React from 'react';
import { Box, Container, Typography, Link, Grid } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              ServePro
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your trusted partner for professional services.
              Quality service delivery at your fingertips.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: support@servepro.com
              <br />
              Phone: +91 9876543210
              <br />
              Address: ServePro Tower, Tech Park,
              <br />
              Bangalore - 560001
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Quick Links
            </Typography>
            <Link href="/about" color="inherit" display="block">
              About Us
            </Link>
            <Link href="/services" color="inherit" display="block">
              Services
            </Link>
            <Link href="/contact" color="inherit" display="block">
              Contact
            </Link>
            <Link href="/privacy" color="inherit" display="block">
              Privacy Policy
            </Link>
          </Grid>
        </Grid>
        <Box mt={3}>
          <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="/">
              ServePro
            </Link>{' '}
            {new Date().getFullYear()}
            {'. All rights reserved.'}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
