import React from 'react';
import { Box, Toolbar } from '@mui/material';
import RecruiterSidebar from './RecruiterSidebar';
import Navbar from './Navbar';

const drawerWidth = 260;


const RecruiterLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar />
      <RecruiterSidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          minHeight: '100vh',
          width: { sm: `calc(100% - ${drawerWidth}px)` }
        }}
      >
        <Toolbar /> {/* Spacer for fixed navbar */}
        {children}
      </Box>
    </Box>
  );
};

export default RecruiterLayout;
