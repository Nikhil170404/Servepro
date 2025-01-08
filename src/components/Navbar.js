import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  useTheme,
  useMediaQuery,
  Button,
  Divider,
  Link,
} from '@mui/material';
import {
  AccountCircle as AccountIcon,
  Notifications as NotificationsIcon,
  ExitToApp as LogoutIcon,
  Support as SupportIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotifications = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setNotificationAnchor(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleProfile = () => {
    navigate('/profile');
    handleClose();
  };

  const handleSupport = () => {
    navigate('/support');
    handleClose();
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component={Link}
          to="/"
          sx={{
            mr: 2,
            display: { xs: 'none', md: 'flex' },
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          ServePro
        </Typography>

        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mr: 2 }}>
            <Button color="inherit" onClick={() => navigate('/dashboard')}>
              Dashboard
            </Button>
            <Button color="inherit" onClick={() => navigate('/services')}>
              Services
            </Button>
            <Button color="inherit" onClick={() => navigate('/support')}>
              Support
            </Button>
          </Box>
        )}

        <IconButton
          color="inherit"
          onClick={handleNotifications}
        >
          <NotificationsIcon />
        </IconButton>

        <IconButton
          onClick={handleMenu}
          color="inherit"
        >
          {user?.photoURL ? (
            <Avatar 
              src={user.photoURL} 
              alt={user.email}
              sx={{ width: 32, height: 32 }}
            />
          ) : (
            <AccountIcon />
          )}
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2" color="textSecondary">
              {user?.email}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={handleProfile}>
            <AccountIcon sx={{ mr: 1 }} /> Profile
          </MenuItem>
          <MenuItem onClick={handleSupport}>
            <SupportIcon sx={{ mr: 1 }} /> Support
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 1 }} /> Logout
          </MenuItem>
        </Menu>

        <Menu
          anchorEl={notificationAnchor}
          open={Boolean(notificationAnchor)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <Box sx={{ p: 2, minWidth: 300 }}>
            <Typography variant="subtitle1" gutterBottom>
              Notifications
            </Typography>
            <Typography variant="body2" color="textSecondary">
              No new notifications
            </Typography>
          </Box>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
