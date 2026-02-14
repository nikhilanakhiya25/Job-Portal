import React, { useState, useEffect } from 'react';
import axios from 'axios';

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Grid,
  TextField,
  Card,
  CardContent,
  Alert,
  Chip,
  CardActions,
  Avatar,
  Paper
} from '@mui/material';

import {
  Menu as MenuIcon,
  Work,
  Search,
  Business,
  People,
  TrendingUp,
  Code,
  DesignServices,
  Engineering,
  AccountBalance,
  HealthAndSafety,
  School,
  LocationOn,
  CheckCircle,
  Star
} from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const PublicLayout = ({ children }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statsData, setStatsData] = useState({
    totalJobs: 10000,
    totalCompanies: 5000,
    totalJobSeekers: 50000,
    successRate: 95
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Contact Us', path: '/contact' }
  ];

  useEffect(() => {
    fetchJobs();
    fetchStats();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/jobs');
      setJobs(response.data.slice(0, 6)); // Show only first 6 jobs
    } catch (err) {
      setError('Failed to fetch jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/dashboard/public-stats');
      setStatsData(response.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      // Keep default values if API fails
    }
  };

  const stats = [
    { title: 'Active Jobs', value: `${statsData.totalJobs.toLocaleString()}+`, icon: <Work fontSize='large' /> },
    { title: 'Companies', value: `${statsData.totalCompanies.toLocaleString()}+`, icon: <Business fontSize='large' /> },
    { title: 'Job Seekers', value: `${statsData.totalJobSeekers.toLocaleString()}+`, icon: <People fontSize='large' /> },
    { title: 'Success Rate', value: `${statsData.successRate}%`, icon: <TrendingUp fontSize='large' /> }
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f5f7fb' }}>
      {/* NAVBAR */}
      <AppBar position="sticky" sx={{ bgcolor: 'white', color: 'primary.main', boxShadow: 1 }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Work sx={{ mr: 1, fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>JobPortal</Typography>
            </Box>

            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {menuItems.map((item) => (
                  <Button key={item.label} component={RouterLink} to={item.path} sx={{ color: 'primary.main' }}>
                    {item.label}
                  </Button>
                ))}
                <Button variant="outlined" component={RouterLink} to="/login">Login</Button>
                <Button variant="contained" component={RouterLink} to="/register">Sign Up</Button>
              </Box>
            )}

            {isMobile && (
              <>
                <IconButton onClick={handleMenu}><MenuIcon /></IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                  {menuItems.map((item) => (
                    <MenuItem key={item.label} component={RouterLink} to={item.path} onClick={handleClose}>
                      {item.label}
                    </MenuItem>
                  ))}
                  <MenuItem component={RouterLink} to="/login" onClick={handleClose}>Login</MenuItem>
                  <MenuItem component={RouterLink} to="/register" onClick={handleClose}>Sign Up</MenuItem>
                </Menu>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* HERO SECTION - Only show on home page */}
      {isHomePage && (
        <Box
          sx={{
            background: `linear-gradient(135deg, rgba(37, 99, 235, 0.9), rgba(124, 58, 237, 0.9)), url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&h=1080&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white',
            py: { xs: 8, md: 12 },
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.4)',
              zIndex: 1
            }
          }}
        >
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                  Find Your Dream Job Today
                </Typography>
                <Typography sx={{ opacity: 0.95, mb: 4, fontSize: '1.1rem', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                  Connect with top companies and explore thousands of job opportunities tailored to your skills.
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, bgcolor: 'white', p: 1, borderRadius: 3, boxShadow: 3 }}>
                  <TextField size="small" fullWidth placeholder="Search job title or company" />
                  <Button variant="contained" startIcon={<Search />}>Search</Button>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box component="img" src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=400&fit=crop" alt="job" sx={{ width: '100%', borderRadius: 4, boxShadow: 6 }} />
              </Grid>
            </Grid>
          </Container>
        </Box>
      )}

      {/* STATS - Only show on home page */}
      {isHomePage && (
        <Container maxWidth="lg" sx={{ mt: -6, mb: 8 }}>
          <Grid container spacing={3}>
            {stats.map((stat, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Card sx={{ textAlign: 'center', borderRadius: 4, boxShadow: 4 }}>
                  <CardContent>
                    <Box sx={{ mb: 2 }}>{stat.icon}</Box>
                    <Typography variant="h4" fontWeight="bold">{stat.value}</Typography>
                    <Typography color="text.secondary">{stat.title}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}

      {/* JOB CATEGORIES SECTION - Only show on home page */}
      {isHomePage && (
        <Box sx={{ bgcolor: 'white', py: 8 }}>
          <Container maxWidth="lg">
            <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 6, fontWeight: 'bold' }}>
              Explore Job Categories
            </Typography>

            <Grid container spacing={4}>
              {[
                { title: 'Technology', icon: <Code fontSize="large" />, jobs: '2,500+', color: '#2563eb' },
                { title: 'Design', icon: <DesignServices fontSize="large" />, jobs: '1,200+', color: '#7c3aed' },
                { title: 'Engineering', icon: <Engineering fontSize="large" />, jobs: '1,800+', color: '#059669' },
                { title: 'Finance', icon: <AccountBalance fontSize="large" />, jobs: '950+', color: '#dc2626' },
                { title: 'Healthcare', icon: <HealthAndSafety fontSize="large" />, jobs: '1,100+', color: '#ea580c' },
                { title: 'Education', icon: <School fontSize="large" />, jobs: '800+', color: '#7c2d12' }
              ].map((category, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      borderRadius: 3,
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 6
                      }
                    }}
                  >
                    <Box sx={{ color: category.color, mb: 2, fontSize: 48 }}>
                      {category.icon}
                    </Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {category.title}
                    </Typography>
                    <Typography color="text.secondary">
                      {category.jobs} jobs available
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}

      {/* FEATURES SECTION - Only show on home page */}
      {isHomePage && (
        <Box sx={{ bgcolor: '#f8fafc', py: 8 }}>
          <Container maxWidth="lg">
            <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 6, fontWeight: 'bold' }}>
              Why Choose JobPortal?
            </Typography>

            <Grid container spacing={4}>
              {[
                {
                  icon: <CheckCircle fontSize="large" sx={{ color: '#10b981' }} />,
                  title: 'Verified Companies',
                  description: 'All companies are verified and trusted by thousands of job seekers worldwide.'
                },
                {
                  icon: <Star fontSize="large" sx={{ color: '#f59e0b' }} />,
                  title: 'Smart Matching',
                  description: 'Our AI-powered system matches you with jobs that fit your skills and preferences.'
                },
                {
                  icon: <LocationOn fontSize="large" sx={{ color: '#ef4444' }} />,
                  title: 'Remote & On-site',
                  description: 'Find opportunities both remotely and at company locations across the globe.'
                },
                {
                  icon: <TrendingUp fontSize="large" sx={{ color: '#8b5cf6' }} />,
                  title: 'Career Growth',
                  description: 'Access to premium jobs and career advancement opportunities.'
                }
              ].map((feature, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                    <Box sx={{ flexShrink: 0, mt: 1 }}>
                      {feature.icon}
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {feature.title}
                      </Typography>
                      <Typography color="text.secondary">
                        {feature.description}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}

      {/* SUCCESS STORIES SECTION - Only show on home page */}
      {isHomePage && (
        <Box sx={{ bgcolor: 'white', py: 8 }}>
          <Container maxWidth="lg">
            <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 6, fontWeight: 'bold' }}>
              Success Stories
            </Typography>

            <Grid container spacing={4}>
              {[
                {
                  name: 'Sarah Johnson',
                  role: 'Software Engineer',
                  company: 'Google',
                  image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
                  quote: 'JobPortal helped me find my dream job at Google. The platform is intuitive and the matching algorithm is spot on!'
                },
                {
                  name: 'Michael Chen',
                  role: 'Product Manager',
                  company: 'Microsoft',
                  image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
                  quote: 'Within 2 weeks of joining JobPortal, I landed a senior position. The quality of opportunities is unmatched.'
                },
                {
                  name: 'Emily Rodriguez',
                  role: 'UX Designer',
                  company: 'Adobe',
                  image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
                  quote: 'The personalized recommendations and easy application process made my job search seamless and successful.'
                }
              ].map((story, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar src={story.image} sx={{ width: 60, height: 60, mr: 2 }} />
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {story.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {story.role} at {story.company}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                      "{story.quote}"
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}

      {/* FEATURED JOBS SECTION - Only show on home page */}
      {isHomePage && (
        <Container maxWidth="lg" sx={{ mb: 8 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
            Featured Jobs
          </Typography>

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <Typography>Loading jobs...</Typography>
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          ) : jobs.length === 0 ? (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No jobs available at the moment.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {jobs.map((job) => (
                <Grid item xs={12} md={6} lg={4} key={job._id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {job.title}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Business sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {job.company}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Work sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {job.location}
                        </Typography>
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {job.description.substring(0, 100)}...
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                          Skills:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {job.skillsRequired.slice(0, 3).map((skill) => (
                            <Chip
                              key={skill}
                              label={skill}
                              size="small"
                              variant="outlined"
                              color="primary"
                            />
                          ))}
                          {job.skillsRequired.length > 3 && (
                            <Chip
                              label={`+${job.skillsRequired.length - 3} more`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </Box>

                      <Typography variant="caption" color="text.secondary">
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </Typography>
                    </CardContent>

                    <CardActions>
                      <Button size="small" variant="contained" component={RouterLink} to="/login">
                        Apply Now
                      </Button>
                      <Button size="small" variant="outlined" component={RouterLink} to="/login">
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {jobs.length > 0 && (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button variant="outlined" size="large" component={RouterLink} to="/login">
                View All Jobs
              </Button>
            </Box>
          )}
        </Container>
      )}

      {/* MAIN PAGE CONTENT */}
      <Box sx={{ flex: 1 }}>{children}</Box>


      {/* FOOTER */}
      <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 6, mt: 'auto' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Work sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">JobPortal</Typography>
              </Box>
              <Typography sx={{ opacity: 0.8 }}>
                Connecting talent with opportunity. Find your dream job or hire the best candidates.
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>Quick Links</Typography>
              {menuItems.map((item) => (
                <Button key={item.label} component={RouterLink} to={item.path} sx={{ color: 'white', display: 'block', justifyContent: 'flex-start' }}>
                  {item.label}
                </Button>
              ))}
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>Contact</Typography>
              <Typography sx={{ opacity: 0.8 }}>support@jobportal.com</Typography>
              <Typography sx={{ opacity: 0.8 }}>+1 555 123 4567</Typography>
              <Typography sx={{ opacity: 0.8 }}>Career City, World</Typography>
            </Grid>
          </Grid>

          <Box sx={{ borderTop: 1, borderColor: 'grey.700', mt: 4, pt: 2, textAlign: 'center' }}>
            <Typography sx={{ opacity: 0.6 }}>©2026 JobPortal</Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default PublicLayout;
