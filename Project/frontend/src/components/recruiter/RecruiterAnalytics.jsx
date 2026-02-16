import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress
} from '@mui/material';
import {
  TrendingUp,
  People,
  Work,
  CheckCircle,
  Cancel,
  Schedule
} from '@mui/icons-material';
import axios from 'axios';

const RecruiterAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/recruiter/analytics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(response.data);
    } catch (err) {
      setError('Failed to load analytics data');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
      </Container>
    );
  }

  const overview = analytics?.overview || {};

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        <TrendingUp sx={{ verticalAlign: 'middle', mr: 1 }} />
        Recruitment Analytics
      </Typography>

      {/* Overview Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Work sx={{ mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography color="textSecondary">Total Jobs</Typography>
                  <Typography variant="h4">{overview.totalJobs}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <People sx={{ mr: 2, color: 'info.main' }} />
                <Box>
                  <Typography color="textSecondary">Total Applicants</Typography>
                  <Typography variant="h4">{overview.totalApplications}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CheckCircle sx={{ mr: 2, color: 'success.main' }} />
                <Box>
                  <Typography color="textSecondary">Shortlisted</Typography>
                  <Typography variant="h4">{overview.shortlisted}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Cancel sx={{ mr: 2, color: 'error.main' }} />
                <Box>
                  <Typography color="textSecondary">Rejected</Typography>
                  <Typography variant="h4">{overview.rejected}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Conversion Rate */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Overall Conversion Rate
          </Typography>
          <Box display="flex" alignItems="center">
            <Box flexGrow={1} mr={2}>
              <LinearProgress 
                variant="determinate" 
                value={parseFloat(overview.conversionRate) || 0} 
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
            <Typography variant="h6">
              {overview.conversionRate}%
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Percentage of applicants who were shortlisted
          </Typography>
        </CardContent>
      </Card>

      {/* Job Performance Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Job Performance Details
          </Typography>
          
          {analytics?.jobPerformance?.length > 0 ? (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Job Title</TableCell>
                    <TableCell align="center">Total Applicants</TableCell>
                    <TableCell align="center">Shortlisted</TableCell>
                    <TableCell align="center">Rejected</TableCell>
                    <TableCell align="center">Pending</TableCell>
                    <TableCell align="center">Conversion Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analytics.jobPerformance.map((job) => {
                    const conversionRate = job.totalApplicants > 0 
                      ? ((job.shortlisted / job.totalApplicants) * 100).toFixed(1)
                      : 0;
                    
                    return (
                      <TableRow key={job.jobId}>
                        <TableCell>{job.title}</TableCell>
                        <TableCell align="center">{job.totalApplicants}</TableCell>
                        <TableCell align="center">
                          <Typography color="success.main">{job.shortlisted}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography color="error.main">{job.rejected}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography color="warning.main">{job.pending}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box display="flex" alignItems="center" justifyContent="center">
                            <LinearProgress 
                              variant="determinate" 
                              value={parseFloat(conversionRate)} 
                              sx={{ width: 60, mr: 1, height: 6 }}
                            />
                            {conversionRate}%
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
              No job data available. Post jobs to see analytics.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default RecruiterAnalytics;
