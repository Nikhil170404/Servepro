import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  AppBar,
  Toolbar,
  useMediaQuery,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CodeIcon from '@mui/icons-material/Code';
import WebIcon from '@mui/icons-material/Web';
import StorageIcon from '@mui/icons-material/Storage';

const services = [
  {
    title: 'Web Development',
    description: 'Full-stack web development services using modern technologies',
    icon: <WebIcon fontSize="large" color="primary" />
  },
  {
    title: 'Custom Solutions',
    description: 'Tailored software solutions for your business needs',
    icon: <CodeIcon fontSize="large" color="primary" />
  },
  {
    title: 'Database Design',
    description: 'Efficient and scalable database architecture',
    icon: <StorageIcon fontSize="large" color="primary" />
  }
];

function Home() {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            WebDev Services
          </Typography>
          <Button 
            color="inherit" 
            onClick={() => navigate('/login')}
            sx={{ mx: 1 }}
          >
            Login
          </Button>
          <Button 
            color="inherit" 
            variant="outlined"
            onClick={() => navigate('/signup')}
            sx={{ 
              ml: 1,
              borderColor: 'white',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 8,
          pb: 6,
        }}
      >
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Professional Web Development Services
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" paragraph>
            Transforming your ideas into powerful digital solutions. 
            Specialized in creating custom web applications for startups and companies.
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button variant="contained" size="large" onClick={() => navigate('/signup')}>
              Get Started
            </Button>
            <Button variant="outlined" size="large">
              Learn More
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Services Section */}
      <Container sx={{ py: 8 }} maxWidth="md">
        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 3
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>{service.icon}</Box>
                  <Typography gutterBottom variant="h5" component="h2">
                    {service.title}
                  </Typography>
                  <Typography>
                    {service.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default Home;
