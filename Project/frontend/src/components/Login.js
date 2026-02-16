import React, { useState, useContext, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  Avatar,
  Grid,
  Divider,
  Chip
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LinkedInLogin from './LinkedInLogin';


const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [selectedRole, setSelectedRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginResult, setLoginResult] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Test credentials for different roles
  const testCredentials = {
    admin: { email: 'admin@test.com', password: 'admin123' },
    recruiter: { email: 'recruiter@test.com', password: 'recruiter123' },
    jobseeker: { email: 'jobseeker@test.com', password: 'jobseeker123' }
  };

  // Auto-fill jobseeker credentials on component mount
  useEffect(() => {
    handleRoleSelect('jobseeker');
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setFormData({
      email: testCredentials[role].email,
      password: testCredentials[role].password
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      setLoginResult(result);
      
      // Redirect based on user role
      const userRole = result.user?.role;
      
      if (userRole === 'admin') {
        navigate('/admin');
      } else if (userRole === 'recruiter') {
        navigate('/recruiter/dashboard');
      } else if (userRole === 'jobseeker') {
        navigate('/jobseeker/dashboard');
      } else {
        // Default fallback
        navigate('/jobseeker/dashboard');
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            width: '100%',
            mt: 2
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {loginResult && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Login successful! Role: <Chip 
                label={loginResult.user?.role} 
                color="primary" 
                size="small" 
                sx={{ ml: 1 }}
              />
            </Alert>
          )}

          {/* Role Selection for Testing */}
          <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Quick Test Login (Select Role):
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              <Button
                size="small"
                variant={selectedRole === 'jobseeker' ? 'contained' : 'outlined'}
                color="primary"
                onClick={() => handleRoleSelect('jobseeker')}
              >
                Job Seeker
              </Button>
              <Button
                size="small"
                variant={selectedRole === 'recruiter' ? 'contained' : 'outlined'}
                color="secondary"
                onClick={() => handleRoleSelect('recruiter')}
              >
                Recruiter
              </Button>
              <Button
                size="small"
                variant={selectedRole === 'admin' ? 'contained' : 'outlined'}
                color="error"
                onClick={() => handleRoleSelect('admin')}
              >
                Admin
              </Button>
            </Box>
            <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
              Click a role above to auto-fill test credentials
            </Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
            
            <Divider sx={{ my: 2 }}>
              <Chip label="OR" size="small" />
            </Divider>
            
            <LinkedInLogin 
              onSuccess={(data) => {
                setLoginResult(data);
                const userRole = data.user?.role;
                if (userRole === 'admin') {
                  navigate('/admin');
                } else if (userRole === 'recruiter') {
                  navigate('/recruiter/dashboard');
                } else {
                  navigate('/jobseeker/dashboard');
                }
              }}
              onError={(errorMsg) => {
                setError(errorMsg);
              }}
            />
            
            <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
              <Grid item>
                <Link component={RouterLink} to="/register" variant="body2">
                  Don't have an account? Sign Up
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};


export default Login;
