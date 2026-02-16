import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LinkedInCallback } from 'react-linkedin-login-oauth2';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import About from './components/About';
import ContactUs from './components/ContactUs';
import ProtectedRoutes from './components/ProtectedRoutes';
import MainLayout from './layout/MainLayout';
import PublicLayout from './layout/PublicLayout';
import RecruiterLayout from './layout/RecruiterLayout';
import RecruiterRoute from './components/recruiter/RecruiterRoute';
import RecruiterDashboard from './components/recruiter/RecruiterDashboard';
import CompanyProfile from './components/recruiter/CompanyProfile';
import RecruiterManageJobs from './components/recruiter/RecruiterManageJobs';
import RecruiterPostJob from './components/recruiter/RecruiterPostJob';
import RecruiterApplicants from './components/recruiter/RecruiterApplicants';
import RecruiterAnalytics from './components/recruiter/RecruiterAnalytics';
import JobSeekerLayout from './layout/JobSeekerLayout';
import JobSeekerRoute from './components/jobseeker/JobSeekerRoute';
import JobSeekerDashboard from './components/jobseeker/JobSeekerDashboard';
import JobSeekerApplications from './components/jobseeker/JobSeekerApplications';
import JobSeekerWishlist from './components/jobseeker/JobSeekerWishlist';
import JobList from './components/JobList';
import UserProfile from './components/UserProfile';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <PublicLayout>
                <Home />
              </PublicLayout>
            } />
            <Route path="/login" element={
              <PublicLayout>
                <Login />
              </PublicLayout>
            } />
            <Route path="/register" element={
              <PublicLayout>
                <Register />
              </PublicLayout>
            } />
            <Route path="/about" element={
              <PublicLayout>
                <About />
              </PublicLayout>
            } />
            <Route path="/contact" element={
              <PublicLayout>
                <ContactUs />
              </PublicLayout>
            } />
            
            {/* LinkedIn OAuth Callback */}
            <Route path="/linkedin/callback" element={<LinkedInCallback />} />

            {/* Recruiter Routes */}
            <Route path="/recruiter/dashboard" element={
              <RecruiterRoute>
                <RecruiterLayout>
                  <RecruiterDashboard />
                </RecruiterLayout>
              </RecruiterRoute>
            } />
            <Route path="/recruiter/company" element={
              <RecruiterRoute>
                <RecruiterLayout>
                  <CompanyProfile />
                </RecruiterLayout>
              </RecruiterRoute>
            } />
            <Route path="/recruiter/manage-jobs" element={
              <RecruiterRoute>
                <RecruiterLayout>
                  <RecruiterManageJobs />
                </RecruiterLayout>
              </RecruiterRoute>
            } />
            <Route path="/recruiter/post-job" element={
              <RecruiterRoute>
                <RecruiterLayout>
                  <RecruiterPostJob />
                </RecruiterLayout>
              </RecruiterRoute>
            } />
            <Route path="/recruiter/applicants" element={
              <RecruiterRoute>
                <RecruiterLayout>
                  <RecruiterApplicants />
                </RecruiterLayout>
              </RecruiterRoute>
            } />
            <Route path="/recruiter/analytics" element={
              <RecruiterRoute>
                <RecruiterLayout>
                  <RecruiterAnalytics />
                </RecruiterLayout>
              </RecruiterRoute>
            } />

            {/* Job Seeker Routes */}
            <Route path="/jobseeker/dashboard" element={
              <JobSeekerRoute>
                <JobSeekerLayout>
                  <JobSeekerDashboard />
                </JobSeekerLayout>
              </JobSeekerRoute>
            } />
            <Route path="/jobseeker/jobs" element={
              <JobSeekerRoute>
                <JobSeekerLayout>
                  <JobList />
                </JobSeekerLayout>
              </JobSeekerRoute>
            } />
            <Route path="/jobseeker/applications" element={
              <JobSeekerRoute>
                <JobSeekerLayout>
                  <JobSeekerApplications />
                </JobSeekerLayout>
              </JobSeekerRoute>
            } />
            <Route path="/jobseeker/wishlist" element={
              <JobSeekerRoute>
                <JobSeekerLayout>
                  <JobSeekerWishlist />
                </JobSeekerLayout>
              </JobSeekerRoute>
            } />
            <Route path="/jobseeker/profile" element={
              <JobSeekerRoute>
                <JobSeekerLayout>
                  <UserProfile />
                </JobSeekerLayout>
              </JobSeekerRoute>
            } />

            {/* Protected Routes */}
            <Route path="/*" element={
              <MainLayout>
                <ProtectedRoutes />
              </MainLayout>
            } />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
