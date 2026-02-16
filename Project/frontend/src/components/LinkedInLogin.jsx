import React from 'react';
import { LinkedIn as LinkedInOAuth } from 'react-linkedin-login-oauth2';
import { Box } from '@mui/material';
import { LinkedIn } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const LinkedInLogin = ({ onSuccess, onError }) => {
  const navigate = useNavigate();
  
  // LinkedIn OAuth Configuration
  const clientId = process.env.REACT_APP_LINKEDIN_CLIENT_ID || 'YOUR_LINKEDIN_CLIENT_ID';
  const redirectUri = process.env.REACT_APP_LINKEDIN_REDIRECT_URI || 'http://localhost:3000/linkedin/callback';
  const scope = 'r_liteprofile r_emailaddress';

  const handleSuccess = async (data) => {
    try {
      console.log('LinkedIn Auth Code:', data.code);
      
      // Send authorization code to backend
      const response = await axios.post('http://localhost:5000/api/auth/linkedin', {
        code: data.code,
        redirectUri: redirectUri
      });

      if (response.data.token) {
        // Store token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Call success callback
        if (onSuccess) {
          onSuccess(response.data);
        }
        
        // Redirect based on role
        const { role } = response.data.user;
        switch(role) {
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'recruiter':
            navigate('/recruiter/dashboard');
            break;
          case 'jobseeker':
          default:
            navigate('/dashboard');
            break;
        }
      }
    } catch (error) {
      console.error('LinkedIn login error:', error);
      if (onError) {
        onError(error.response?.data?.message || 'LinkedIn login failed');
      }
    }
  };

  const handleFailure = (error) => {
    console.error('LinkedIn OAuth error:', error);
    if (onError) {
      onError(error.errorMessage || 'LinkedIn authentication failed');
    }
  };

  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <LinkedInOAuth
        clientId={clientId}
        redirectUri={redirectUri}
        scope={scope}
        onSuccess={handleSuccess}
        onFailure={handleFailure}
        style={{ 
          background: '#0077b5',
          color: 'white',
          fontSize: '16px',
          padding: '12px 24px',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          width: '100%',
          justifyContent: 'center',
          fontWeight: 600,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          transition: 'all 0.3s'
        }}
      >
        <LinkedIn sx={{ fontSize: 20 }} />
        Continue with LinkedIn
      </LinkedInOAuth>
    </Box>

  );
};

export default LinkedInLogin;
