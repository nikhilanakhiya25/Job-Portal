import React, { useState, useEffect, useContext } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  useNavigate 
} from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import {
  People as PeopleIcon,
  Work as WorkIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  Block as BlockIcon,
  Pending as PendingIcon,
  CheckCircle as CheckCircleIcon,
  Visibility as VisibilityIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
    activeJobs: 0,
    pendingJobs: 0,
    blockedUsers: 0,
    pendingUsers: 0,
    recentActivity: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardStats();
    fetchRecentActivity();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/logs?limit=5');
      setRecentActivity(response.data.logs || []);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  const StatCard = ({ title, value, icon, color, subtitle, onClick }) => (
    <Card 
      sx={{ 
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s',
        '&:hover': onClick ? { transform: 'translateY(-2px)', boxShadow: 4 } : {}
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {loading ? '...' : value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="textSecondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ color: color }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const getActivityIcon = (action) => {
    if (action.includes('user')) return <PeopleIcon />;
    if (action.includes('job')) return <WorkIcon />;
    if (action.includes('application')) return <AssignmentIcon />;
    return <TrendingUpIcon />;
  };

  const getActivityColor = (action) => {
    if (action.includes('blocked') || action.includes('deleted') || action.includes('rejected')) return 'error';
    if (action.includes('approved') || action.includes('created')) return 'success';
    return 'info';
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={3}>
        <AdminIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
        <Box>
          <Typography variant="h4" gutterBottom>
            Admin Dashboard
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Welcome back, {user?.name || 'Admin'}! Here's what's happening on your platform.
          </Typography>
        </Box>
      </Box>

      {/* Statistics Grid */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<PeopleIcon sx={{ fontSize: 40 }} />}
            color="primary.main"
            subtitle={`${stats.blockedUsers} blocked, ${stats.pendingUsers} pending`}
            onClick={() => navigate('/admin/manage-users')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Jobs"
            value={stats.totalJobs}
            icon={<WorkIcon sx={{ fontSize: 40 }} />}
            color="success.main"
            subtitle={`${stats.activeJobs} active, ${stats.pendingJobs} pending`}
            onClick={() => navigate('/admin/manage-jobs')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Applications"
            value={stats.totalApplications}
            icon={<AssignmentIcon sx={{ fontSize: 40 }} />}
            color="info.main"
            subtitle="Total submissions"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Recent Activity"
            value={stats.recentActivity}
            icon={<TrendingUpIcon sx={{ fontSize: 40 }} />}
            color="warning.main"
            subtitle="Last 24 hours"
            onClick={() => navigate('/admin/activity-logs')}
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <PeopleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Manage Users</Typography>
              </Box>
              <Typography variant="body2" color="textSecondary" paragraph>
                View, approve, or block user accounts. Manage job seekers and recruiters.
              </Typography>
              <Button 
                variant="contained" 
                fullWidth
                onClick={() => navigate('/admin/manage-users')}
              >
                Manage Users
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <WorkIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Manage Jobs</Typography>
              </Box>
              <Typography variant="body2" color="textSecondary" paragraph>
                Approve, reject, or delete job listings. Monitor job posting activity.
              </Typography>
              <Button 
                variant="contained" 
                fullWidth
                onClick={() => navigate('/admin/manage-jobs')}
              >
                Manage Jobs
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <AssessmentIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">Analytics</Typography>
              </Box>
              <Typography variant="body2" color="textSecondary" paragraph>
                View skill demand analytics, user growth trends, and platform usage reports.
              </Typography>
              <Button 
                variant="contained" 
                fullWidth
                onClick={() => navigate('/admin/analytics')}
              >
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TimelineIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Activity Logs</Typography>
              </Box>
              <Typography variant="body2" color="textSecondary" paragraph>
                Monitor system activity, user actions, and admin operations in real-time.
              </Typography>
              <Button 
                variant="contained" 
                fullWidth
                onClick={() => navigate('/admin/activity-logs')}
              >
                View Logs
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h6">
                Recent Activity
              </Typography>
              <Button 
                size="small" 
                onClick={() => navigate('/admin/activity-logs')}
              >
                View All
              </Button>
            </Box>
            <List>
              {recentActivity.length === 0 ? (
                <ListItem>
                  <ListItemText primary="No recent activity" />
                </ListItem>
              ) : (
                recentActivity.map((log, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      {getActivityIcon(log.action)}
                    </ListItemIcon>
                    <ListItemText
                      primary={log.description}
                      secondary={new Date(log.createdAt).toLocaleString()}
                    />
                    <Chip 
                      label={log.action.replace('_', ' ')} 
                      size="small"
                      color={getActivityColor(log.action)}
                    />
                  </ListItem>
                ))
              )}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Platform Status
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="System Operational" 
                  secondary="All services running normally"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PendingIcon color="warning" />
                </ListItemIcon>
                <ListItemText 
                  primary={`${stats.pendingJobs} Jobs Pending`} 
                  secondary="Awaiting approval"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <BlockIcon color="error" />
                </ListItemIcon>
                <ListItemText 
                  primary={`${stats.blockedUsers} Blocked Users`} 
                  secondary="Restricted access"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <VisibilityIcon color="info" />
                </ListItemIcon>
                <ListItemText 
                  primary="Monitoring Active" 
                  secondary="Real-time tracking enabled"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
