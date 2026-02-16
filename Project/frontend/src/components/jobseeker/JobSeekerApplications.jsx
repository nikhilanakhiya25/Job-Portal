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
  Chip,
  Box,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import axios from 'axios';

const JobSeekerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get('http://localhost:5000/api/dashboard/my-applications', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setApplications(response.data || []);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load applications');
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          My Applications
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchApplications}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Job Title</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Applied Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Match Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="textSecondary" sx={{ py: 3 }}>
                    No applications found. Start applying for jobs!
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              applications.map((app) => (
                <TableRow key={app._id}>
                  <TableCell>{app.job?.title || 'N/A'}</TableCell>
                  <TableCell>{app.job?.company || 'N/A'}</TableCell>
                  <TableCell>{app.job?.location || 'N/A'}</TableCell>
                  <TableCell>{formatDate(app.createdAt)}</TableCell>
                  <TableCell>
                    <Chip
                      label={app.status}
                      color={getStatusColor(app.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {app.matchScore ? (
                      <Chip
                        label={`${app.matchScore}%`}
                        color={app.matchScore >= 80 ? 'success' : app.matchScore >= 60 ? 'warning' : 'error'}
                        size="small"
                      />
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default JobSeekerApplications;
