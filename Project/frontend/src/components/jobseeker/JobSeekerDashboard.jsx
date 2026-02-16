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
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Work as WorkIcon,
  Favorite as FavoriteIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const JobSeekerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalApplications: 0,
    wishlistCount: 0,
    recommendedJobs: 0
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch dashboard stats
      const statsRes = await axios.get('http://localhost:5000/api/dashboard/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Fetch recent applications
      const appsRes = await axios.get('http://localhost:5000/api/dashboard/my-applications', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Fetch job recommendations
      const recRes = await axios.get('http://localhost:5000/api/dashboard/recommendations', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStats({
        totalApplications: appsRes.data?.length || 0,
        wishlistCount: statsRes.data?.wishlistCount || 0,
        recommendedJobs: recRes.data?.length || 0
      });

      setRecentApplications(appsRes.data?.slice(0, 5) || []);
      setRecommendedJobs(recRes.data?.slice(0, 5) || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'success';
      case 'rejected': return 'error';
      case 'shortlisted': return 'warning';
      case 'pending': return 'info';
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome back, {user?.name}!
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AssignmentIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Applications
                  </Typography>
                  <Typography variant="h5">
                    {stats.totalApplications}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <FavoriteIcon color="error" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Saved Jobs
                  </Typography>
                  <Typography variant="h5">
                    {stats.wishlistCount}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <WorkIcon color="success" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Recommended
                  </Typography>
                  <Typography variant="h5">
                    {stats.recommendedJobs}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUpIcon color="warning" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Profile Match
                  </Typography>
                  <Typography variant="h5">
                    {user?.skills?.length || 0} Skills
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Applications & Recommended Jobs */}
      <Grid container spacing={3}>
        {/* Recent Applications */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Applications
            </Typography>
            {recentApplications.length === 0 ? (
              <Typography color="textSecondary" align="center" sx={{ py: 3 }}>
                No applications yet. Start applying for jobs!
              </Typography>
            ) : (
              <List>
                {recentApplications.map((app) => (
                  <ListItem key={app._id} divider>
                    <ListItemText
                      primary={app.job?.title || 'Unknown Job'}
                      secondary={app.job?.company || 'Unknown Company'}
                    />
                    <Chip
                      label={app.status}
                      color={getStatusColor(app.status)}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            )}
            <Button
              fullWidth
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={() => navigate('/jobseeker/applications')}
            >
              View All Applications
            </Button>
          </Paper>
        </Grid>

        {/* Recommended Jobs */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recommended Jobs
            </Typography>
            {recommendedJobs.length === 0 ? (
              <Typography color="textSecondary" align="center" sx={{ py: 3 }}>
                No recommendations yet. Complete your profile to get personalized job matches!
              </Typography>
            ) : (
              <List>
                {recommendedJobs.map((job) => (
                  <ListItem key={job._id} divider>
                    <ListItemText
                      primary={job.title}
                      secondary={`${job.company} • ${job.location}`}
                    />
                    <Chip
                      label={`${job.matchPercentage || 0}% Match`}
                      color="primary"
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            )}
            <Button
              fullWidth
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={() => navigate('/jobseeker/jobs')}
            >
              Browse All Jobs
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<WorkIcon />}
              onClick={() => navigate('/jobseeker/jobs')}
            >
              Find Jobs
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<FavoriteIcon />}
              onClick={() => navigate('/jobseeker/wishlist')}
            >
              View Wishlist
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<AssignmentIcon />}
              onClick={() => navigate('/jobseeker/applications')}
            >
              My Applications
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate('/jobseeker/profile')}
            >
              Update Profile
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default JobSeekerDashboard;
