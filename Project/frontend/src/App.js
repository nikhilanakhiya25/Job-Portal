import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import About from './components/About';
import ContactUs from './components/ContactUs';
import ProtectedRoutes from './components/ProtectedRoutes';
import MainLayout from './layout/MainLayout';
import PublicLayout from './layout/PublicLayout';
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
