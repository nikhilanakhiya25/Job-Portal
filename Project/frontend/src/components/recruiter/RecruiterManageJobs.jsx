import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Tooltip
} from '@mui/material';
import {
  Work,
  Edit,
  Delete,
  People,
  TrendingUp,
  Add,
  Visibility
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RecruiterManageJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    skillsRequired: '',
    experience: '',
    salary: '',
    location: ''
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/recruiter/jobs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(response.data);
    } catch (err) {
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/recruiter/jobs/${selectedJob._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setJobs(jobs.filter(job => job._id !== selectedJob._id));
      setDeleteDialogOpen(false);
      setSelectedJob(null);
    } catch (err) {
      setError('Failed to delete job');
    }
  };

  const handleEdit = (job) => {
    setSelectedJob(job);
    setEditFormData({
      title: job.title,
      description: job.description,
      skillsRequired: job.skillsRequired.join(', '),
      experience: job.experience,
      salary: job.salary,
      location: job.location
    });
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const updateData = {
        ...editFormData,
        skillsRequired: editFormData.skillsRequired.split(',').map(s => s.trim()).filter(s => s)
      };
      
      const response = await axios.put(
        `http://localhost:5000/api/recruiter/jobs/${selectedJob._id}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setJobs(jobs.map(job => 
        job._id === selectedJob._id ? response.data : job
      ));
      
      setEditDialogOpen(false);
      setSelectedJob(null);
    } catch (err) {
      setError('Failed to update job');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          <Work sx={{ verticalAlign: 'middle', mr: 1 }} />
          Manage Jobs
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/recruiter/post-job')}
        >
          Post New Job
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {jobs.length === 0 ? (
        <Card>
          <CardContent>
            <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
              No jobs posted yet. Start by posting your first job!
            </Typography>
            <Box textAlign="center">
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate('/recruiter/post-job')}
              >
                Post Job
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {jobs.map((job) => (
            <Grid item xs={12} md={6} lg={4} key={job._id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Typography variant="h6" sx={{ flex: 1 }}>
                      {job.title}
                    </Typography>
                    <Chip
                      label={job.approvalStatus}
                      color={getStatusColor(job.approvalStatus)}
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {job.company}
                  </Typography>

                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {job.description.substring(0, 100)}...
                  </Typography>

                  {/* Analytics */}
                  <Box display="flex" gap={2} mb={2}>
                    <Tooltip title="Total Applicants">
                      <Box display="flex" alignItems="center">
                        <People sx={{ mr: 0.5, color: 'primary.main' }} />
                        <Typography variant="body2">
                          {job.analytics?.totalApplicants || 0}
                        </Typography>
                      </Box>
                    </Tooltip>
                    
                    <Tooltip title="Shortlisted">
                      <Box display="flex" alignItems="center">
                        <TrendingUp sx={{ mr: 0.5, color: 'success.main' }} />
                        <Typography variant="body2" color="success.main">
                          {job.analytics?.shortlisted || 0}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </Box>

                  {/* Skills */}
                  <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
                    {job.skillsRequired.slice(0, 3).map((skill, idx) => (
                      <Chip key={idx} label={skill} size="small" variant="outlined" />
                    ))}
                    {job.skillsRequired.length > 3 && (
                      <Chip 
                        label={`+${job.skillsRequired.length - 3}`} 
                        size="small" 
                        variant="outlined" 
                      />
                    )}
                  </Box>

                  {/* Actions */}
                  <Box display="flex" gap={1}>
                    <Button
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => navigate(`/recruiter/applicants?job=${job._id}`)}
                      variant="outlined"
                    >
                      View ({job.analytics?.totalApplicants || 0})
                    </Button>
                    
                    <Tooltip title="Edit">
                      <IconButton 
                        size="small"
                        onClick={() => handleEdit(job)}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Delete">
                      <IconButton 
                        size="small"
                        color="error"
                        onClick={() => {
                          setSelectedJob(job);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Job</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedJob?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Job</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Job Title"
            value={editFormData.title}
            onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
            sx={{ mt: 2 }}
          />
          
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={4}
            value={editFormData.description}
            onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
            sx={{ mt: 2 }}
          />
          
          <TextField
            fullWidth
            label="Required Skills (comma-separated)"
            value={editFormData.skillsRequired}
            onChange={(e) => setEditFormData({...editFormData, skillsRequired: e.target.value})}
            sx={{ mt: 2 }}
          />
          
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Experience</InputLabel>
            <Select
              value={editFormData.experience}
              onChange={(e) => setEditFormData({...editFormData, experience: e.target.value})}
              label="Experience"
            >
              <MenuItem value="0-1 years">0-1 years</MenuItem>
              <MenuItem value="1-3 years">1-3 years</MenuItem>
              <MenuItem value="3-5 years">3-5 years</MenuItem>
              <MenuItem value="5+ years">5+ years</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            label="Salary"
            value={editFormData.salary}
            onChange={(e) => setEditFormData({...editFormData, salary: e.target.value})}
            sx={{ mt: 2 }}
          />
          
          <TextField
            fullWidth
            label="Location"
            value={editFormData.location}
            onChange={(e) => setEditFormData({...editFormData, location: e.target.value})}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RecruiterManageJobs;
