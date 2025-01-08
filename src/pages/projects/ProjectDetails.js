import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  Description as DescriptionIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSnackbar } from '../../context/SnackbarContext';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { format } from 'date-fns';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const docRef = doc(db, 'projects', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('Project not found');
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  const handleDelete = async () => {
    if (deleteConfirmation !== project.title) {
      showSnackbar('Please type the project title correctly to confirm deletion', 'error');
      return;
    }

    try {
      await deleteDoc(doc(db, 'projects', id));
      showSnackbar('Project deleted successfully', 'success');
      navigate('/projects');
    } catch (err) {
      console.error('Error deleting project:', err);
      showSnackbar('Failed to delete project', 'error');
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'in progress':
        return 'info';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      return format(timestamp.toDate(), 'MMM dd, yyyy');
    } catch (error) {
      return format(new Date(timestamp), 'MMM dd, yyyy');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !project) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error || 'Project not found'}</Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/projects')}
          sx={{ mt: 2 }}
        >
          Back to Projects
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            {project.title}
          </Typography>
          <Box>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/projects/${id}/edit`)}
              sx={{ mr: 1 }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialog(true)}
            >
              Delete
            </Button>
          </Box>
        </Box>

        <Chip
          label={project.status}
          color={getStatusColor(project.status)}
          sx={{ mb: 3 }}
        />

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <DescriptionIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Description"
                  secondary={project.description}
                />
              </ListItem>
              <Divider />
              
              <ListItem>
                <ListItemIcon>
                  <CalendarIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Created Date"
                  secondary={formatDate(project.createdAt)}
                />
              </ListItem>
              <Divider />

              <ListItem>
                <ListItemIcon>
                  <MoneyIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Budget"
                  secondary={`$${project.budget?.toLocaleString() || 'N/A'}`}
                />
              </ListItem>
              <Divider />

              <ListItem>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Client"
                  secondary={project.clientName || user.email}
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Paper>

      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Delete Project</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to delete this project? This action cannot be undone.
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            Please type "{project.title}" to confirm deletion:
          </Typography>
          <TextField
            fullWidth
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete Project
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProjectDetails;
