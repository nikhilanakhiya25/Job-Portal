import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const JobSeekerWishlist = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get('http://localhost:5000/api/dashboard/wishlist', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setWishlist(response.data || []);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setError('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (jobId) => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.delete(`http://localhost:5000/api/dashboard/wishlist/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Remove from local state
      setWishlist(wishlist.filter(job => job._id !== jobId));
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      setError('Failed to remove job from wishlist');
    }
  };

  const applyForJob = (jobId) => {
    navigate(`/jobseeker/jobs?apply=${jobId}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Wishlist
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {wishlist.length === 0 ? (
        <Box textAlign="center" py={5}>
          <FavoriteIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Your wishlist is empty
          </Typography>
          <Typography color="textSecondary" paragraph>
            Save jobs you're interested in to view them here later.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/jobseeker/jobs')}
          >
            Browse Jobs
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {wishlist.map((job) => (
            <Grid item xs={12} md={6} key={job._id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Typography variant="h6" component="h2" gutterBottom>
                      {job.title}
                    </Typography>
                    <IconButton
                      color="error"
                      onClick={() => removeFromWishlist(job._id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  
                  <Typography color="textSecondary" gutterBottom>
                    {job.company}
                  </Typography>
                  
                  <Box display="flex" gap={1} mb={2}>
                    <Chip
                      icon={<LocationIcon />}
                      label={job.location}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      icon={<WorkIcon />}
                      label={job.type || 'Full-time'}
                      size="small"
                      variant="outlined"
                    />
                  </Box>

                  <Typography variant="body2" color="textSecondary" paragraph>
                    {job.description?.substring(0, 150)}...
                  </Typography>

                  <Box display="flex" gap={1} flexWrap="wrap">
                    {job.skills?.slice(0, 3).map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                    {job.skills?.length > 3 && (
                      <Chip
                        label={`+${job.skills.length - 3} more`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => applyForJob(job._id)}
                  >
                    Apply Now
                  </Button>
                  <Button
                    size="small"
                    onClick={() => navigate(`/jobseeker/jobs?id=${job._id}`)}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default JobSeekerWishlist;
