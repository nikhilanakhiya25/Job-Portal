import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Button,
  Alert,
} from '@mui/material';
import axios from 'axios';

export default function ViewApplicants() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);


  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/dashboard/admin/applications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applicants:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicationId, newStatus) => {
    try {
      setActionLoading(applicationId);
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/applications/${applicationId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchApplicants(); // Refresh the list
    } catch (error) {
      setError('Failed to update application status. Please try again.');
      console.error('Error updating status:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied': return 'default';
      case 'Under Review': return 'primary';
      case 'Interview': return 'secondary';
      case 'Accepted': return 'success';
      case 'Rejected': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return <Typography>Loading applicants...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        View Applicants
      </Typography>
      <Paper sx={{ p: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Applicant</TableCell>
                <TableCell>Job Title</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Skills Match</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app._id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2 }}>{app.user.name.charAt(0)}</Avatar>
                      <Box>
                        <Typography variant="body1">{app.user.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{app.user.email}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{app.job.title}</TableCell>
                  <TableCell>{app.job.company}</TableCell>
                  <TableCell>{app.skillMatch || 'N/A'}%</TableCell>
                  <TableCell>
                    <Chip label={app.status} color={getStatusColor(app.status)} />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => updateStatus(app._id, 'Under Review')}
                      disabled={app.status !== 'Applied'}
                    >
                      Review
                    </Button>
                    <Button
                      size="small"
                      onClick={() => updateStatus(app._id, 'Interview')}
                      disabled={app.status === 'Accepted' || app.status === 'Rejected'}
                    >
                      Interview
                    </Button>
                    <Button
                      size="small"
                      color="success"
                      onClick={() => updateStatus(app._id, 'Accepted')}
                      disabled={app.status === 'Rejected'}
                    >
                      Accept
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => updateStatus(app._id, 'Rejected')}
                      disabled={app.status === 'Accepted'}
                    >
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
