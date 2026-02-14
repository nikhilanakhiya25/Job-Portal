import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  Avatar,
  Button,
  Chip,
  Paper
} from '@mui/material';
import {
  Work,
  People,
  Business,
  TrendingUp,
  CheckCircle,
  Handshake,
  Security,
  Speed
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const About = () => {
  const stats = [
    { value: '10,000+', label: 'Active Jobs', icon: <Work fontSize="large" /> },
    { value: '5,000+', label: 'Partner Companies', icon: <Business fontSize="large" /> },
    { value: '50,000+', label: 'Job Seekers', icon: <People fontSize="large" /> },
    { value: '95%', label: 'Success Rate', icon: <TrendingUp fontSize="large" /> }
  ];

  const values = [
    {
      icon: <CheckCircle fontSize="large" sx={{ color: '#10b981' }} />,
      title: 'Trust & Transparency',
      description: 'We believe in complete transparency. All job listings are verified, and we provide honest feedback throughout your job search journey.'
    },
    {
      icon: <Handshake fontSize="large" sx={{ color: '#3b82f6' }} />,
      title: 'Candidate-First Approach',
      description: 'Our platform is designed with job seekers in mind. Every feature we build focuses on helping you land your dream job faster.'
    },
    {
      icon: <Security fontSize="large" sx={{ color: '#8b5cf6' }} />,
      title: 'Data Security',
      description: 'Your personal information is secure with us. We use enterprise-grade encryption to protect your data.'
    },
    {
      icon: <Speed fontSize="large" sx={{ color: '#f59e0b' }} />,
      title: 'Fast & Efficient',
      description: 'Our streamlined process helps you apply to jobs in minutes and receive responses faster than traditional methods.'
    }
  ];

  const team = [
    {
      name: 'Alex Thompson',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
      bio: 'Former HR Director with 15+ years of experience in talent acquisition.'
    },
    {
      name: 'Sarah Chen',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
      bio: 'Tech leader specializing in AI/ML solutions for recruitment.'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
      bio: 'Operations expert with a passion for building scalable platforms.'
    }
  ];

  return (
    <Box sx={{ bgcolor: '#f5f7fb', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=1080&fit=crop")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.15
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{ fontWeight: 'bold', fontSize: { xs: '2.5rem', md: '3.5rem' } }}
              >
                About JobPortal
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.95, mb: 4, lineHeight: 1.8 }}>
                We are dedicated to bridging the gap between talented individuals and 
                exceptional career opportunities. Our mission is to make job searching 
                simpler, faster, and more effective for everyone.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  component={RouterLink}
                  to="/register"
                  sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  component={RouterLink}
                  to="/contact"
                  sx={{ borderColor: 'white', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                >
                  Contact Us
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
                alt="Team working together"
                sx={{ width: '100%', borderRadius: 4, boxShadow: 6 }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ mt: -6, mb: 8 }}>
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Paper
                elevation={4}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 3,
                  bgcolor: 'white',
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>{stat.icon}</Box>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {stat.value}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Our Story Section */}
      <Box sx={{ py: 8, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                Our Story
              </Typography>
              <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 3 }}>
                Founded in 2020, JobPortal began with a simple vision: to revolutionize how people 
                find jobs and how companies find talent. We recognized that traditional job hunting 
                was time-consuming, frustrating, and often ineffective.
              </Typography>
              <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 3 }}>
                Today, we've helped over 50,000 job seekers find their dream careers and connected 
                thousands of companies with the perfect candidates. Our AI-powered matching system 
                ensures that every connection made through our platform is meaningful and productive.
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                We continue to innovate and improve, constantly adding new features and improvements 
                based on user feedback and industry best practices.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop"
                alt="Our team"
                sx={{ width: '100%', borderRadius: 4, boxShadow: 4 }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Our Values Section */}
      <Box sx={{ py: 8, bgcolor: '#f5f7fb' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Our Values
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6, maxWidth: 700, mx: 'auto' }}>
            These core values guide everything we do at JobPortal
          </Typography>
          <Grid container spacing={4}>
            {values.map((value, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    borderRadius: 3,
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': { transform: 'translateY(-8px)', boxShadow: 6 }
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ mb: 2 }}>{value.icon}</Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {value.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {value.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Our Team Section */}
      <Box sx={{ py: 8, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Meet Our Team
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6, maxWidth: 700, mx: 'auto' }}>
            The passionate people behind JobPortal who work tirelessly to help you succeed
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {team.map((member, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    transition: 'transform 0.3s',
                    '&:hover': { transform: 'translateY(-4px)' }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <Avatar
                      src={member.image}
                      sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                    />
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {member.name}
                    </Typography>
                    <Chip label={member.role} color="primary" size="small" sx={{ mb: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      {member.bio}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          py: 8,
          textAlign: 'center',
          color: 'white'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Ready to Start Your Journey?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.95 }}>
            Join thousands of job seekers who have found their dream jobs through JobPortal
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              component={RouterLink}
              to="/register"
              sx={{ bgcolor: 'white', color: 'primary.main', px: 4, '&:hover': { bgcolor: 'grey.100' } }}
            >
              Create Free Account
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={RouterLink}
              to="/login"
              sx={{ borderColor: 'white', color: 'white', px: 4, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
            >
              Sign In
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default About;
