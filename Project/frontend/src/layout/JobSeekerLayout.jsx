import React from 'react';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import JobSeekerSidebar from './JobSeekerSidebar';

const JobSeekerLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <JobSeekerSidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          minHeight: '100vh',
          marginLeft: '240px', // Width of sidebar
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default JobSeekerLayout;
