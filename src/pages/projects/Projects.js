import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  CircularProgress,
  Alert,
  LinearProgress,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Add as AddIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { format } from 'date-fns';

const Projects = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user?.uid) return;

    const projectsQuery = query(
      collection(db, 'projects'),
      where('clientId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(projectsQuery, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projectsData);
      setLoading(false);
    }, (err) => {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

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

  const getCompletionPercentage = (project) => {
    switch (project.status?.toLowerCase()) {
      case 'completed':
        return 100;
      case 'in progress':
        return 50;
      case 'pending':
        return 0;
      default:
        return 0;
    }
  };

  const filteredProjects = projects
    .filter(project => {
      if (filterStatus !== 'all' && project.status !== filterStatus) return false;
      if (searchTerm && !project.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return b.createdAt?.toDate() - a.createdAt?.toDate();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Projects
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/projects/new')}
        >
          New Project
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1 }}
          InputProps={{
            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
          }}
        />
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Filter</InputLabel>
          <Select
            value={filterStatus}
            label="Filter"
            onChange={(e) => setFilterStatus(e.target.value)}
            startAdornment={<FilterIcon sx={{ mr: 1 }} />}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="in progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value)}
            startAdornment={<SortIcon sx={{ mr: 1 }} />}
          >
            <MenuItem value="date">Date</MenuItem>
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="status">Status</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {filteredProjects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {project.title}
                </Typography>
                <Typography color="textSecondary" variant="body2" gutterBottom>
                  {project.description?.slice(0, 100)}...
                </Typography>
                <Box sx={{ mt: 2, mb: 1 }}>
                  <Chip
                    label={project.status}
                    color={getStatusColor(project.status)}
                    size="small"
                  />
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Progress
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={getCompletionPercentage(project)}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                  Created: {formatDate(project.createdAt)}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate(`/projects/${project.id}`)}>
                  View Details
                </Button>
                <Button size="small" onClick={() => navigate(`/projects/${project.id}/edit`)}>
                  Edit
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredProjects.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No projects found
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/projects/new')}
            sx={{ mt: 2 }}
          >
            Create Your First Project
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default Projects;
