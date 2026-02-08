import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import JobList from './JobList';
import UserProfile from './UserProfile';
import MyJobs from './MyJobs';
import Wishlist from './Wishlist';
import AdminDashboard from './admin/AdminDashboard';
import PostJob from './admin/PostJob.js';
import ManageJobs from './admin/ManageJobs';
import ViewApplicants from './admin/ViewApplicants';
import AdminRoute from './AdminRoute';
import ProtectedRoute from './ProtectedRoute';

const ProtectedRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/jobs" element={<ProtectedRoute><JobList /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
      <Route path="/my-jobs" element={<ProtectedRoute><MyJobs /></ProtectedRoute>} />
      <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/post-job" element={<AdminRoute><PostJob /></AdminRoute>} />
      <Route path="/admin/manage-jobs" element={<AdminRoute><ManageJobs /></AdminRoute>} />
      <Route path="/admin/view-applicants" element={<AdminRoute><ViewApplicants /></AdminRoute>} />
    </Routes>
  );
};

export default ProtectedRoutes;
