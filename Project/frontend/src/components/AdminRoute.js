import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  console.log('AdminRoute - Loading:', loading);
  console.log('AdminRoute - User:', user);
  console.log('AdminRoute - User Role:', user?.role);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log('AdminRoute - No user, redirecting to login');
    return <Navigate to="/login" />;
  }

  if (user.role !== 'admin') {
    console.log('AdminRoute - User is not admin, redirecting to dashboard. Role:', user.role);
    return <Navigate to="/dashboard" />;
  }

  console.log('AdminRoute - Admin access granted');
  return children;
};

export default AdminRoute;
