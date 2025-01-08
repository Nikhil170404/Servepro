import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  LinearProgress,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Menu,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as UsersIcon,
  Assignment as RequestsIcon,
  Settings as SettingsIcon,
  AccountCircle,
  Notifications as NotificationsIcon,
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  Group as GroupIcon,
  Assessment as AssessmentIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/config';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  getDocs
} from 'firebase/firestore';

const drawerWidth = 240;

function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [serviceRequests, setServiceRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [updateDialog, setUpdateDialog] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [comments, setComments] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentSection, setCurrentSection] = useState('dashboard');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch service requests
        const requestsQuery = query(
          collection(db, 'serviceRequests'),
          orderBy('createdAt', 'desc')
        );

        const unsubscribeRequests = onSnapshot(requestsQuery, (snapshot) => {
          const requests = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              createdAt: data.createdAt?.toDate?.() 
                ? data.createdAt.toDate() 
                : new Date(data.createdAt || Date.now())
            };
          });
          setServiceRequests(requests);

          // Update stats
          setStats(prev => ({
            ...prev,
            totalRequests: requests.length,
            pendingRequests: requests.filter(r => r.status === 'pending').length,
            completedRequests: requests.filter(r => r.status === 'completed').length,
            revenue: requests
              .filter(r => r.status === 'completed')
              .reduce((acc, curr) => acc + (curr.amount || 0), 0)
          }));
        });

        // Fetch users
        const usersQuery = query(collection(db, 'users'));
        const usersSnapshot = await getDocs(usersQuery);
        const usersData = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersData);
        setStats(prev => ({
          ...prev,
          totalUsers: usersData.length
        }));

        setLoading(false);
        return () => unsubscribeRequests();
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleUpdateRequest = async () => {
    if (!selectedRequest) return;

    try {
      const requestRef = doc(db, 'serviceRequests', selectedRequest.id);
      await updateDoc(requestRef, {
        status,
        progress: Number(progress),
        comments,
        updatedAt: new Date()
      });

      setUpdateDialog(false);
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  const handleOpenUpdate = (request) => {
    setSelectedRequest(request);
    setStatus(request.status);
    setProgress(request.progress);
    setComments(request.comments || '');
    setUpdateDialog(true);
  };

  const getStatusChipColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Admin Panel
        </Typography>
      </Toolbar>
      <List>
        <ListItem button onClick={() => setCurrentSection('dashboard')}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button onClick={() => setCurrentSection('requests')}>
          <ListItemIcon>
            <RequestsIcon />
          </ListItemIcon>
          <ListItemText primary="Service Requests" />
        </ListItem>
        <ListItem button onClick={() => setCurrentSection('users')}>
          <ListItemIcon>
            <UsersIcon />
          </ListItemIcon>
          <ListItemText primary="Users" />
        </ListItem>
        <ListItem button onClick={() => setCurrentSection('analytics')}>
          <ListItemIcon>
            <AssessmentIcon />
          </ListItemIcon>
          <ListItemText primary="Analytics" />
        </ListItem>
        <ListItem button onClick={() => setCurrentSection('settings')}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
    </Box>
  );

  const renderDashboardContent = () => {
    switch (currentSection) {
      case 'dashboard':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Users
                  </Typography>
                  <Typography variant="h4">
                    {stats.totalUsers}
                  </Typography>
                  <GroupIcon color="primary" sx={{ fontSize: 40 }} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Pending Requests
                  </Typography>
                  <Typography variant="h4">
                    {stats.pendingRequests}
                  </Typography>
                  <RequestsIcon color="warning" sx={{ fontSize: 40 }} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Completed Projects
                  </Typography>
                  <Typography variant="h4">
                    {stats.completedRequests}
                  </Typography>
                  <AssessmentIcon color="success" sx={{ fontSize: 40 }} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Revenue
                  </Typography>
                  <Typography variant="h4">
                    ${stats.revenue.toLocaleString()}
                  </Typography>
                  <MoneyIcon color="primary" sx={{ fontSize: 40 }} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Recent Service Requests
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Service</TableCell>
                      <TableCell>Client</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {serviceRequests.slice(0, 5).map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          {request.createdAt?.toLocaleDateString()}
                        </TableCell>
                        <TableCell>{request.serviceId}</TableCell>
                        <TableCell>{request.userEmail}</TableCell>
                        <TableCell>
                          <Chip
                            label={request.status}
                            color={getStatusChipColor(request.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Update Status">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenUpdate(request)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
          </Grid>
        );
      case 'requests':
        return (
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              All Service Requests
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Service</TableCell>
                    <TableCell>Client</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Progress</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {serviceRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        {request.createdAt?.toLocaleDateString()}
                      </TableCell>
                      <TableCell>{request.serviceId}</TableCell>
                      <TableCell>{request.userEmail}</TableCell>
                      <TableCell>
                        <Chip
                          label={request.status}
                          color={getStatusChipColor(request.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ width: '100%', mr: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={request.progress}
                              sx={{ height: 10, borderRadius: 5 }}
                            />
                          </Box>
                          <Box sx={{ minWidth: 35 }}>
                            <Typography variant="body2" color="text.secondary">
                              {request.progress}%
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Update Status">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenUpdate(request)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        );
      case 'users':
        return (
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              User Management
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Joined Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.role}
                          color={user.role === 'admin' ? 'secondary' : 'primary'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.status || 'active'}
                          color="success"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {user.createdAt?.toDate?.() 
                          ? user.createdAt.toDate().toLocaleDateString()
                          : new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        );
      case 'analytics':
        return (
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Analytics Dashboard
            </Typography>
            {/* Add analytics content here */}
          </Paper>
        );
      case 'settings':
        return (
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Admin Settings
            </Typography>
            {/* Add settings content here */}
          </Paper>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={() => navigate(-1)}
            sx={{ mr: 2 }}
            aria-label="back"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        {renderDashboardContent()}
      </Box>

      <Dialog open={updateDialog} onClose={() => setUpdateDialog(false)}>
        <DialogTitle>Update Service Request</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            margin="normal"
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
            <MenuItem value="in_progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </TextField>

          <TextField
            fullWidth
            type="number"
            label="Progress (%)"
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
            margin="normal"
            InputProps={{
              inputProps: {
                min: 0,
                max: 100
              }
            }}
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateRequest} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
