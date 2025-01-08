import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  Reply as ReplyIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';

const statusColors = {
  open: 'error',
  'in-progress': 'warning',
  resolved: 'success',
};

function Support() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [adminReply, setAdminReply] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, 'support_tickets'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ticketsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      setTickets(ticketsData);
    });

    return () => unsubscribe();
  }, []);

  const handleReply = (ticket) => {
    setSelectedTicket(ticket);
    setNewStatus(ticket.status);
    setAdminReply(ticket.adminReply || '');
    setReplyDialogOpen(true);
  };

  const handleView = (ticket) => {
    setSelectedTicket(ticket);
    setViewDialogOpen(true);
  };

  const handleSaveReply = async () => {
    if (!selectedTicket) return;

    try {
      await updateDoc(doc(db, 'support_tickets', selectedTicket.id), {
        status: newStatus,
        adminReply,
        updatedAt: new Date(),
      });
      setReplyDialogOpen(false);
      setSelectedTicket(null);
    } catch (error) {
      console.error('Error updating ticket:', error);
    }
  };

  const handleDelete = async (ticketId) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        await deleteDoc(doc(db, 'support_tickets', ticketId));
      } catch (error) {
        console.error('Error deleting ticket:', error);
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Support Tickets
      </Typography>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Subject</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>{ticket.subject}</TableCell>
                  <TableCell>{ticket.userEmail}</TableCell>
                  <TableCell>
                    <Chip 
                      label={ticket.status} 
                      color={statusColors[ticket.status] || 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    {ticket.createdAt?.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleView(ticket)} size="small">
                      <ViewIcon />
                    </IconButton>
                    <IconButton onClick={() => handleReply(ticket)} size="small">
                      <ReplyIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDelete(ticket.id)}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)}>
        <DialogTitle>Ticket Details</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2">Subject</Typography>
          <Typography paragraph>{selectedTicket?.subject}</Typography>
          
          <Typography variant="subtitle2">Client</Typography>
          <Typography paragraph>{selectedTicket?.userEmail}</Typography>
          
          <Typography variant="subtitle2">Message</Typography>
          <Typography paragraph>{selectedTicket?.message}</Typography>
          
          <Typography variant="subtitle2">Status</Typography>
          <Chip 
            label={selectedTicket?.status} 
            color={statusColors[selectedTicket?.status] || 'default'}
          />
          
          {selectedTicket?.adminReply && (
            <>
              <Typography variant="subtitle2" sx={{ mt: 2 }}>Admin Reply</Typography>
              <Typography>{selectedTicket.adminReply}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog open={replyDialogOpen} onClose={() => setReplyDialogOpen(false)}>
        <DialogTitle>Reply to Ticket</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            margin="normal"
          >
            <MenuItem value="open">Open</MenuItem>
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="resolved">Resolved</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Reply Message"
            value={adminReply}
            onChange={(e) => setAdminReply(e.target.value)}
            margin="normal"
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReplyDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveReply} variant="contained">Send Reply</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Support;
