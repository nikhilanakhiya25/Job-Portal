import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  LinearProgress,
  Tooltip,
  IconButton,
  Fade,
  Zoom
} from '@mui/material';
import {
  Business,
  People,
  Work,
  TrendingUp,
  CheckCircle,
  Cancel,
  Schedule,
  ArrowForward,
  Add,
  Assessment,
  PersonAdd,
  ArrowUpward,
  ArrowDownward,
  MoreVert
} from '@mui/icons-material';

import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Animated Card Component
const AnimatedCard = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.div>
);

// Stat Card Component
const StatCard = ({ title, value, icon, color, trend, trendValue }) => (
  <Card 
    sx={{ 
      bgcolor: color,
      borderRadius: 3,
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
      }
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box display="flex" alignItems="flex-start" justifyContent="space-between">
        <Box>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mb: 1, fontWeight: 500 }}
          >
            {title}
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {value}
          </Typography>
          {trend && (
            <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
              {trend === 'up' ? (
                <ArrowUpward sx={{ fontSize: 16, color: 'success.main' }} />
              ) : (
                <ArrowDownward sx={{ fontSize: 16, color: 'error.main' }} />
              )}
              <Typography 
                variant="caption" 
                color={trend === 'up' ? 'success.main' : 'error.main'}
                sx={{ ml: 0.5, fontWeight: 600 }}
              >
                {trendValue}
              </Typography>
            </Box>
          )}
        </Box>
        <Box 
          sx={{ 
            p: 1.5, 
            borderRadius: 2, 
            bgcolor: 'rgba(255,255,255,0.8)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

// Empty State Component
const EmptyState = ({ icon, title, description, actionText, onAction }) => (
  <Box 
    display="flex" 
    flexDirection="column" 
    alignItems="center" 
    justifyContent="center" 
    py={6}
    px={3}
  >
    <Box 
      sx={{ 
        p: 3, 
        borderRadius: '50%', 
        bgcolor: 'primary.light',
        mb: 2
      }}
    >
      {icon}
    </Box>
    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3, maxWidth: 400 }}>
      {description}
    </Typography>
    {actionText && (
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={onAction}
        sx={{ borderRadius: 2 }}
      >
        {actionText}
      </Button>
    )}
  </Box>
);

const RecruiterDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/recruiter/analytics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(response.data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  const hasData = analytics?.overview?.totalJobs > 0;

  const stats = [
    {
      title: 'Total Jobs',
      value: analytics?.overview?.totalJobs || 0,
      icon: <Work sx={{ fontSize: 32, color: 'primary.main' }} />,
      color: '#e8f4fd',
      trend: 'up',
      trendValue: '+12%'
    },
    {
      title: 'Total Applicants',
      value: analytics?.overview?.totalApplications || 0,
      icon: <People sx={{ fontSize: 32, color: 'info.main' }} />,
      color: '#e0f7fa',
      trend: 'up',
      trendValue: '+8%'
    },
    {
      title: 'Shortlisted',
      value: analytics?.overview?.shortlisted || 0,
      icon: <CheckCircle sx={{ fontSize: 32, color: 'success.main' }} />,
      color: '#e8f5e9',
      trend: 'up',
      trendValue: '+15%'
    },
    {
      title: 'Conversion Rate',
      value: `${analytics?.overview?.conversionRate || 0}%`,
      icon: <TrendingUp sx={{ fontSize: 32, color: 'warning.main' }} />,
      color: '#fff8e1',
      trend: 'down',
      trendValue: '-3%'
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box mb={4}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
            Welcome back, {user?.name || 'Recruiter'}! 👋
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Here's what's happening with your recruitment today
          </Typography>
        </motion.div>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <AnimatedCard delay={index * 0.1}>
              <StatCard {...stat} />
            </AnimatedCard>
          </Grid>
        ))}
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <AnimatedCard delay={0.4}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('/recruiter/post-job')}
                    fullWidth
                    size="large"
                    sx={{ 
                      borderRadius: 2,
                      py: 1.5,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                      '&:hover': {
                        boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)'
                      }
                    }}
                  >
                    Post New Job
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<People />}
                    onClick={() => navigate('/recruiter/applicants')}
                    fullWidth
                    size="large"
                    sx={{ borderRadius: 2, py: 1.5 }}
                  >
                    View Applicants
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Business />}
                    onClick={() => navigate('/recruiter/company')}
                    fullWidth
                    size="large"
                    sx={{ borderRadius: 2, py: 1.5 }}
                  >
                    Company Profile
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Assessment />}
                    onClick={() => navigate('/recruiter/analytics')}
                    fullWidth
                    size="large"
                    sx={{ borderRadius: 2, py: 1.5 }}
                  >
                    Detailed Analytics
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </AnimatedCard>

          {/* Getting Started Tips */}
          {!hasData && (
            <AnimatedCard delay={0.5}>
              <Card sx={{ borderRadius: 3, mt: 3, bgcolor: 'primary.light', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.dark' }}>
                    🚀 Getting Started
                  </Typography>
                  <Typography variant="body2" color="primary.dark" sx={{ mb: 2 }}>
                    Follow these steps to start recruiting:
                  </Typography>
                  <List dense>
                    {[
                      'Complete your company profile',
                      'Post your first job opening',
                      'Review incoming applications',
                      'Shortlist qualified candidates'
                    ].map((step, idx) => (
                      <ListItem key={idx} sx={{ px: 0 }}>
                        <Box 
                          sx={{ 
                            minWidth: 24, 
                            height: 24, 
                            borderRadius: '50%', 
                            bgcolor: 'primary.main',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 2,
                            fontSize: 12,
                            fontWeight: 600
                          }}
                        >
                          {idx + 1}
                        </Box>
                        <ListItemText 
                          primary={step}
                          primaryTypographyProps={{ variant: 'body2', color: 'primary.dark' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </AnimatedCard>
          )}
        </Grid>

        {/* Recent Applications */}
        <Grid item xs={12} md={8}>
          <AnimatedCard delay={0.5}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Recent Applications
                  </Typography>
                  {hasData && (
                    <Button
                      endIcon={<ArrowForward />}
                      onClick={() => navigate('/recruiter/applicants')}
                      size="small"
                    >
                      View All
                    </Button>
                  )}
                </Box>

                {analytics?.recentApplications?.length > 0 ? (
                  <List>
                    {analytics.recentApplications.map((app, index) => (
                      <Zoom in key={app._id} timeout={300 + index * 100}>
                        <Box>
                          <ListItem 
                            sx={{ 
                              px: 2, 
                              py: 1.5,
                              borderRadius: 2,
                              '&:hover': { bgcolor: 'action.hover' },
                              transition: 'background-color 0.2s'
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: 'primary.main' }}>
                                {app.applicantName?.charAt(0) || 'A'}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                  {app.applicantName}
                                </Typography>
                              }
                              secondary={
                                <Typography variant="body2" color="text.secondary">
                                  Applied for: {app.jobTitle}
                                </Typography>
                              }
                            />
                            <Box display="flex" alignItems="center" gap={1}>
                              <Chip
                                label={app.status}
                                color={
                                  app.status === 'shortlisted' ? 'success' :
                                  app.status === 'rejected' ? 'error' :
                                  app.status === 'pending' ? 'warning' : 'default'
                                }
                                size="small"
                                sx={{ fontWeight: 500 }}
                              />
                              <IconButton size="small">
                                <MoreVert />
                              </IconButton>
                            </Box>
                          </ListItem>
                          {index < analytics.recentApplications.length - 1 && (
                            <Divider sx={{ my: 1 }} />
                          )}
                        </Box>
                      </Zoom>
                    ))}
                  </List>
                ) : (
                  <EmptyState
                    icon={<PersonAdd sx={{ fontSize: 48, color: 'primary.main' }} />}
                    title="No Applications Yet"
                    description="Once candidates start applying to your job postings, you'll see them here. Post your first job to get started!"
                    actionText="Post a Job"
                    onAction={() => navigate('/recruiter/post-job')}
                  />
                )}
              </CardContent>
            </Card>
          </AnimatedCard>
        </Grid>
      </Grid>

      {/* Job Performance Section */}
      <Box mt={4}>
        <AnimatedCard delay={0.6}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Job Performance
                </Typography>
                {hasData && (
                  <Button
                    endIcon={<ArrowForward />}
                    onClick={() => navigate('/recruiter/manage-jobs')}
                    size="small"
                  >
                    Manage Jobs
                  </Button>
                )}
              </Box>

              {analytics?.jobPerformance?.length > 0 ? (
                <Grid container spacing={3}>
                  {analytics.jobPerformance.slice(0, 3).map((job, index) => (
                    <Grid item xs={12} md={4} key={job.jobId}>
                      <Fade in timeout={500 + index * 200}>
                        <Card 
                          variant="outlined" 
                          sx={{ 
                            borderRadius: 2,
                            transition: 'transform 0.3s, box-shadow 0.3s',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                            }
                          }}
                        >
                          <CardContent>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                              {job.title}
                            </Typography>
                            
                            <Box mb={2}>
                              <Box display="flex" justifyContent="space-between" mb={1}>
                                <Typography variant="body2" color="text.secondary">
                                  Total Applicants
                                </Typography>
                                <Typography variant="body2" fontWeight={600}>
                                  {job.totalApplicants}
                                </Typography>
                              </Box>
                              <LinearProgress 
                                variant="determinate" 
                                value={Math.min((job.totalApplicants / 50) * 100, 100)}
                                sx={{ 
                                  height: 6, 
                                  borderRadius: 3,
                                  bgcolor: 'grey.200',
                                  '& .MuiLinearProgress-bar': {
                                    bgcolor: 'primary.main',
                                    borderRadius: 3
                                  }
                                }}
                              />
                            </Box>

                            <Box display="flex" gap={1} flexWrap="wrap">
                              <Tooltip title="Shortlisted">
                                <Chip 
                                  icon={<CheckCircle sx={{ fontSize: 16 }} />} 
                                  label={job.shortlisted} 
                                  size="small" 
                                  color="success"
                                  variant="outlined"
                                  sx={{ fontWeight: 500 }}
                                />
                              </Tooltip>
                              <Tooltip title="Pending">
                                <Chip 
                                  icon={<Schedule sx={{ fontSize: 16 }} />} 
                                  label={job.pending} 
                                  size="small" 
                                  color="warning"
                                  variant="outlined"
                                  sx={{ fontWeight: 500 }}
                                />
                              </Tooltip>
                              <Tooltip title="Rejected">
                                <Chip 
                                  icon={<Cancel sx={{ fontSize: 16 }} />} 
                                  label={job.rejected} 
                                  size="small" 
                                  color="error"
                                  variant="outlined"
                                  sx={{ fontWeight: 500 }}
                                />
                              </Tooltip>
                            </Box>
                          </CardContent>
                        </Card>
                      </Fade>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <EmptyState
                  icon={<Work sx={{ fontSize: 48, color: 'primary.main' }} />}
                  title="No Jobs Posted Yet"
                  description="Start building your team by posting your first job opening. You'll be able to track applications and manage candidates here."
                  actionText="Post Your First Job"
                  onAction={() => navigate('/recruiter/post-job')}
                />
              )}
            </CardContent>
          </Card>
        </AnimatedCard>
      </Box>
    </Container>
  );
};

export default RecruiterDashboard;
