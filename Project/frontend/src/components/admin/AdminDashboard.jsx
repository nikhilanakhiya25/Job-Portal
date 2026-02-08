import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">Post Job</Typography>
              <Typography variant="body2">Create a new job posting.</Typography>
              <Button variant="contained" onClick={() => navigate('/admin/post-job')}>
                Go
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">Manage Jobs</Typography>
              <Typography variant="body2">Edit or delete existing jobs.</Typography>
              <Button variant="contained" onClick={() => navigate('/admin/manage-jobs')}>
                Go
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">View Applicants</Typography>
              <Typography variant="body2">Review job applications.</Typography>
              <Button variant="contained" onClick={() => navigate('/admin/view-applicants')}>
                Go
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
