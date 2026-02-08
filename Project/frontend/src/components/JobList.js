import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Box,
  Alert,
  CircularProgress,
  Paper,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Business,
  LocationOn,
  AttachMoney,
  Work,
  Send,
  BusinessCenter,
  Search,
  Clear,
  Favorite,
  FavoriteBorder,
  Star
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    company: '',
    salary: '',
    skills: ''
  });
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [wishlistJobs, setWishlistJobs] = useState([]);
  const [saving, setSaving] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchJobs();
    if (user && user.role === 'jobseeker') {
      fetchAppliedJobs();
      fetchWishlist();
    }
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [jobs, filters]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/jobs');
      setJobs(response.data);
    } catch (err) {
      setError('Failed to fetch jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/dashboard/my-applications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppliedJobs(response.data);
    } catch (err) {
      console.error('Failed to fetch applied jobs:', err);
    }
  };

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/dashboard/wishlist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlistJobs(response.data.map(job => job._id));
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
    }
  };

  const saveToWishlist = async (jobId) => {
    try {
      setSaving(jobId);
      const token = localStorage.getItem('token');
      if (wishlistJobs.includes(jobId)) {
        await axios.delete(`http://localhost:5000/api/dashboard/wishlist/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWishlistJobs(wishlistJobs.filter(id => id !== jobId));
      } else {
        await axios.post(`http://localhost:5000/api/dashboard/wishlist/${jobId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWishlistJobs([...wishlistJobs, jobId]);
      }
    } catch (err) {
      console.error('Failed to update wishlist:', err);
    } finally {
      setSaving(null);
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = [...jobs];

    if (filters.search) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.company.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.location) {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.company) {
      filtered = filtered.filter(job =>
        job.company.toLowerCase().includes(filters.company.toLowerCase())
      );
    }

    if (filters.salary) {
      filtered = filtered.filter(job =>
        job.salary.toLowerCase().includes(filters.salary.toLowerCase())
      );
    }

    if (filters.skills) {
      filtered = filtered.filter(job =>
        job.skillsRequired.some(skill =>
          skill.toLowerCase().includes(filters.skills.toLowerCase())
        )
      );
    }

    setFilteredJobs(filtered);
  }, [jobs, filters]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      company: '',
      salary: '',
      skills: ''
    });
  };

  const applyToJob = async (jobId) => {
    if (!user) {
      alert('Please login to apply for jobs.');
      return;
    }

    try {
      setApplying(jobId);
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/jobs/${jobId}/apply`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert('Application submitted successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply for job. Please try again.');
    } finally {
      setApplying(null);
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
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Available Jobs
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Search and Filter Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Search & Filter Jobs
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search jobs, companies, or keywords"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Location"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              placeholder="e.g., Mumbai, Delhi"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Company"
              value={filters.company}
              onChange={(e) => handleFilterChange('company', e.target.value)}
              placeholder="e.g., Google, Microsoft"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Salary Range"
              value={filters.salary}
              onChange={(e) => handleFilterChange('salary', e.target.value)}
              placeholder="e.g., 5-10 LPA"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Skills"
              value={filters.skills}
              onChange={(e) => handleFilterChange('skills', e.target.value)}
              placeholder="e.g., JavaScript, React"
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Clear />}
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {filteredJobs.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <BusinessCenter sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {jobs.length === 0 ? 'No jobs available at the moment.' : 'No jobs match your filters.'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {jobs.length === 0 ? 'Check back later for new opportunities.' : 'Try adjusting your search criteria.'}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredJobs.map((job) => (
            <Grid item xs={12} md={6} lg={4} key={job._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mr: 1 }}>
                      {job.title}
                    </Typography>
                    {job.isPremium && (
                      <Chip
                        icon={<Star />}
                        label="Premium"
                        size="small"
                        color="warning"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Business sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {job.company}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {job.location}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AttachMoney sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {job.salary}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Work sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {job.experience}
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {job.description.substring(0, 120)}...
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                      Required Skills:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {job.skillsRequired.slice(0, 4).map((skill) => (
                        <Chip
                          key={skill}
                          label={skill}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      ))}
                      {job.skillsRequired.length > 4 && (
                        <Chip
                          label={`+${job.skillsRequired.length - 4} more`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </Box>

                  <Typography variant="caption" color="text.secondary">
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>

                <CardActions>
                  {user && user.role === 'jobseeker' && (
                    appliedJobs.some(app => app.job._id === job._id) ? (
                      <Chip
                        label={`Applied - ${appliedJobs.find(app => app.job._id === job._id)?.status || 'Pending'}`}
                        color={
                          appliedJobs.find(app => app.job._id === job._id)?.status === 'shortlisted' ? 'success' :
                          appliedJobs.find(app => app.job._id === job._id)?.status === 'rejected' ? 'error' :
                          'default'
                        }
                        size="small"
                      />
                    ) : (
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<Send />}
                        onClick={() => applyToJob(job._id)}
                        disabled={applying === job._id}
                        sx={{ mr: 1 }}
                      >
                        {applying === job._id ? 'Applying...' : 'Apply Now'}
                      </Button>
                    )
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default JobList;
