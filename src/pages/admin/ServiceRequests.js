import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  useTheme,
  useMediaQuery,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { services } from '../../config/services';

const statusColors = {
  pending: 'warning',
  'in-progress': 'info',
  completed: 'success',
  cancelled: 'error',
};

function ServiceRequests() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [adminComment, setAdminComment] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterService, setFilterService] = useState('all');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const requestsQuery = query(
      collection(db, 'service_requests'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(requestsQuery, (snapshot) => {
      const requestsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      setRequests(requestsData);
    });

    return () => unsubscribe();
  }, []);

  const handleUpdateRequest = async () => {
    if (!selectedRequest || !newStatus) return;

    try {
      const requestRef = doc(db, 'service_requests', selectedRequest.id);
      await updateDoc(requestRef, {
        status: newStatus,
        adminComment: adminComment,
        updatedAt: new Date()
      });

      setDialogOpen(false);
      setSelectedRequest(null);
      setAdminComment('');
      setNewStatus('');
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  const handleDelete = async (requestId) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        await deleteDoc(doc(db, 'service_requests', requestId));
      } catch (error) {
        console.error('Error deleting request:', error);
      }
    }
  };

  const handleOpenDialog = (request) => {
    setSelectedRequest(request);
    setNewStatus(request.status);
    setAdminComment(request.adminComment || '');
    setDialogOpen(true);
  };

  const handleView = (request) => {
    setSelectedRequest(request);
    setViewDialogOpen(true);
  };

  const filteredRequests = requests.filter(request => {
    if (filterStatus !== 'all' && request.status !== filterStatus) return false;
    if (filterService !== 'all' && request.serviceName !== filterService) return false;
    return true;
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Service Requests
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              label="Status"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Service</InputLabel>
            <Select
              value={filterService}
              label="Service"
              onChange={(e) => setFilterService(e.target.value)}
            >
              <MenuItem value="all">All Services</MenuItem>
              {services.map((service) => (
                <MenuItem key={service.id} value={service.title}>
                  {service.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Plan</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  {request.createdAt?.toLocaleDateString()}
                </TableCell>
                <TableCell>{request.serviceName}</TableCell>
                <TableCell>{request.userEmail}</TableCell>
                <TableCell>{request.plan}</TableCell>
                <TableCell>
                  <Chip 
                    label={request.status} 
                    color={statusColors[request.status] || 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<ViewIcon />}
                      onClick={() => handleView(request)}
                    >
                      View
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleOpenDialog(request)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(request.id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Update Request Status</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={newStatus}
                label="Status"
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Admin Comment"
              multiline
              rows={4}
              value={adminComment}
              onChange={(e) => setAdminComment(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateRequest} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={viewDialogOpen} 
        onClose={() => setViewDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Request Details</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Service</Typography>
              <Typography paragraph>{selectedRequest.serviceName}</Typography>
              
              <Typography variant="subtitle2" gutterBottom>User</Typography>
              <Typography paragraph>{selectedRequest.userEmail}</Typography>
              
              <Typography variant="subtitle2" gutterBottom>Plan</Typography>
              <Typography paragraph>{selectedRequest.plan}</Typography>
              
              <Typography variant="subtitle2" gutterBottom>Status</Typography>
              <Chip 
                label={selectedRequest.status} 
                color={statusColors[selectedRequest.status] || 'default'}
                sx={{ mb: 2 }}
              />
              
              <Typography variant="subtitle2" gutterBottom>Created</Typography>
              <Typography paragraph>
                {selectedRequest.createdAt?.toLocaleDateString()}
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>Details</Typography>
              <Typography paragraph>{selectedRequest.details}</Typography>
              
              {selectedRequest.adminComment && (
                <>
                  <Typography variant="subtitle2" gutterBottom>Admin Comment</Typography>
                  <Typography paragraph>{selectedRequest.adminComment}</Typography>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ServiceRequests;
