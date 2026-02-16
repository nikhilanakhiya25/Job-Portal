import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  People,
  CheckCircle,
  Cancel,
  Schedule,
  Star,
  Download,
  Assessment,
  Email,
  FilterList
} from '@mui/icons-material';
import axios from 'axios';

const RecruiterApplicants = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [bulkActionOpen, setBulkActionOpen] = useState(false);
  const [selectedApplicants, setSelectedApplicants] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');

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
      if (response.data.length > 0) {
        setSelectedJob(response.data[0]);
        fetchApplicants(response.data[0]._id);
      }
    } catch (err) {
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicants = async (jobId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/recruiter/jobs/${jobId}/applicants`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplicants(response.data.applicants);
      setSelectedJob(response.data.job);
    } catch (err) {
      setError('Failed to load applicants');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/recruiter/applicants/${selectedApplicant._id}/status`,
        { status: newStatus, notes: statusNotes },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setApplicants(applicants.map(app => 
        app._id === selectedApplicant._id 
          ? { ...app, status: newStatus }
          : app
      ));

      setStatusDialogOpen(false);
      setSelectedApplicant(null);
      setNewStatus('');
      setStatusNotes('');
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const handleBulkStatusUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/recruiter/bulk-update-status',
        { 
          applicationIds: selectedApplicants, 
          status: newStatus,
          notes: statusNotes 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setApplicants(applicants.map(app => 
        selectedApplicants.includes(app._id)
          ? { ...app, status: newStatus }
          : app
      ));

      setBulkActionOpen(false);
      setSelectedApplicants([]);
      setNewStatus('');
      setStatusNotes('');
    } catch (err) {
      setError('Failed to update statuses');
    }
  };

  const getMatchScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'shortlisted': return 'success';
      case 'rejected': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const filteredApplicants = filterStatus === 'all' 
    ? applicants 
    : applicants.filter(app => app.status === filterStatus);

  if (loading && jobs.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        <People sx={{ verticalAlign: 'middle', mr: 1 }} />
        Manage Applicants
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {/* Job Selection */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Select Job
              </Typography>
              {jobs.map((job) => (
                <Button
                  key={job._id}
                  fullWidth
                  variant={selectedJob?._id === job._id ? 'contained' : 'outlined'}
                  onClick={() => fetchApplicants(job._id)}
                  sx={{ mb: 1, justifyContent: 'flex-start' }}
                >
                  <Box textAlign="left">
                    <Typography variant="body1">{job.title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {job.analytics?.totalApplicants || 0} applicants
                    </Typography>
                  </Box>
                </Button>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Applicants List */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  {selectedJob ? `Applicants for: ${selectedJob.title}` : 'Select a job to view applicants'}
                </Typography>
                
                {applicants.length > 0 && (
                  <Box display="flex" gap={1}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Filter</InputLabel>
                      <Select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        label="Filter"
                      >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="shortlisted">Shortlisted</MenuItem>
                        <MenuItem value="rejected">Rejected</MenuItem>
                      </Select>
                    </FormControl>
                    
                    {selectedApplicants.length > 0 && (
                      <Button
                        variant="contained"
                        onClick={() => setBulkActionOpen(true)}
                      >
                        Bulk Action ({selectedApplicants.length})
                      </Button>
                    )}
                  </Box>
                )}
              </Box>

              {filteredApplicants.length > 0 ? (
                <List>
                  {filteredApplicants.map((applicant) => (
                    <ListItem
                      key={applicant._id}
                      sx={{
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1,
                        mb: 1,
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar>
                          {applicant.user?.name?.charAt(0) || 'A'}
                        </Avatar>
                      </ListItemAvatar>
                      
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="subtitle1">
                              {applicant.user?.name}
                            </Typography>
                            <Chip
                              label={`${applicant.matchScore?.percentage || 0}% Match`}
                              color={getMatchScoreColor(applicant.matchScore?.percentage)}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {applicant.user?.email}
                            </Typography>
                            
                            {/* Match Score Bar */}
                            <Box mt={1}>
                              <LinearProgress
                                variant="determinate"
                                value={applicant.matchScore?.percentage || 0}
                                sx={{ 
                                  height: 6, 
                                  borderRadius: 3,
                                  bgcolor: 'grey.200',
                                  '& .MuiLinearProgress-bar': {
                                    bgcolor: applicant.matchScore?.percentage >= 80 ? 'success.main' :
                                             applicant.matchScore?.percentage >= 60 ? 'warning.main' : 'error.main'
                                  }
                                }}
                              />
                            </Box>

                            {/* Skills */}
                            <Box mt={1} display="flex" flexWrap="wrap" gap={0.5}>
                              {applicant.user?.skills?.slice(0, 3).map((skill, idx) => (
                                <Chip
                                  key={idx}
                                  label={skill}
                                  size="small"
                                  variant="outlined"
                                  color={applicant.matchScore?.matchedSkills?.includes(skill) ? 'success' : 'default'}
                                />
                              ))}
                              {applicant.user?.skills?.length > 3 && (
                                <Chip
                                  label={`+${applicant.user.skills.length - 3}`}
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                            </Box>

                            {/* Skill Gap */}
                            {applicant.skillGap?.length > 0 && (
                              <Typography variant="caption" color="error" display="block" mt={0.5}>
                                Missing: {applicant.skillGap.slice(0, 3).join(', ')}
                                {applicant.skillGap.length > 3 && ` +${applicant.skillGap.length - 3} more`}
                              </Typography>
                            )}
                          </Box>
                        }
                      />

                      <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
                        <Chip
                          label={applicant.status}
                          color={getStatusColor(applicant.status)}
                        />
                        
                        <Box display="flex" gap={0.5}>
                          <Tooltip title="Update Status">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setSelectedApplicant(applicant);
                                setNewStatus(applicant.status);
                                setStatusDialogOpen(true);
                              }}
                            >
                              <Assessment />
                            </IconButton>
                          </Tooltip>
                          
                          {applicant.user?.resumeUrl && (
                            <Tooltip title="Download Resume">
                              <IconButton
                                size="small"
                                href={applicant.user.resumeUrl}
                                target="_blank"
                              >
                                <Download />
                              </IconButton>
                            </Tooltip>
                          )}
                          
                          <input
                            type="checkbox"
                            checked={selectedApplicants.includes(applicant._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedApplicants([...selectedApplicants, applicant._id]);
                              } else {
                                setSelectedApplicants(selectedApplicants.filter(id => id !== applicant._id));
                              }
                            }}
                          />
                        </Box>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                  {selectedJob ? 'No applicants found for this job.' : 'Select a job to view applicants.'}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Application Status</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Applicant: {selectedApplicant?.user?.name}
          </Typography>
          
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="pending">
                <Schedule sx={{ mr: 1 }} /> Pending
              </MenuItem>
              <MenuItem value="shortlisted">
                <CheckCircle sx={{ mr: 1 }} color="success" /> Shortlisted
              </MenuItem>
              <MenuItem value="rejected">
                <Cancel sx={{ mr: 1 }} color="error" /> Rejected
              </MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Notes (optional)"
            value={statusNotes}
            onChange={(e) => setStatusNotes(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleStatusUpdate} variant="contained">
            Update Status
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Action Dialog */}
      <Dialog open={bulkActionOpen} onClose={() => setBulkActionOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Bulk Status Update</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Update status for {selectedApplicants.length} selected applicants
          </Typography>
          
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>New Status</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              label="New Status"
            >
              <MenuItem value="shortlisted">Shortlisted</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Notes (optional)"
            value={statusNotes}
            onChange={(e) => setStatusNotes(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkActionOpen(false)}>Cancel</Button>
          <Button onClick={handleBulkStatusUpdate} variant="contained" color="primary">
            Update All
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RecruiterApplicants;
