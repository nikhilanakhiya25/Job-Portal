import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const JobSeekerRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user is recruiter, redirect to recruiter dashboard
  if (user.role === 'recruiter') {
    return <Navigate to="/recruiter/dashboard" replace />;
  }

  // If user is admin, redirect to admin dashboard
  if (user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  // Allow jobseeker (and any other role) to access job seeker pages
  return children;
};

export default JobSeekerRoute;
