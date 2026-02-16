import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Box,
  Avatar,
  Chip,
  Tooltip
} from '@mui/material';
import {
  Dashboard,
  Business,
  Work,
  People,
  Analytics,
  AddCircle,
  Settings,
  Help
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const drawerWidth = 260;

const RecruiterSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const mainMenuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/recruiter/dashboard', badge: null },
    { text: 'Company Profile', icon: <Business />, path: '/recruiter/company', badge: null },
    { text: 'Manage Jobs', icon: <Work />, path: '/recruiter/manage-jobs', badge: '12' },
    { text: 'Post New Job', icon: <AddCircle />, path: '/recruiter/post-job', badge: null, highlight: true },
    { text: 'Applicants', icon: <People />, path: '/recruiter/applicants', badge: '5' },
    { text: 'Analytics', icon: <Analytics />, path: '/recruiter/analytics', badge: null },
  ];

  const bottomMenuItems = [
    { text: 'Settings', icon: <Settings />, path: '/recruiter/settings' },
    { text: 'Help & Support', icon: <Help />, path: '/recruiter/help' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: 'none',
          background: 'linear-gradient(180deg, #1a237e 0%, #283593 100%)',
          color: 'white',
          boxShadow: '4px 0 20px rgba(0,0,0,0.1)'
        },
      }}
    >
      {/* Logo Section */}
      <Toolbar sx={{ py: 2 }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ display: 'flex', alignItems: 'center', gap: 12 }}
        >
          <Avatar 
            sx={{ 
              bgcolor: 'white', 
              color: 'primary.main',
              width: 40,
              height: 40,
              fontWeight: 700
            }}
          >
            R
          </Avatar>
          <Box>
            <Typography variant="h6" noWrap sx={{ fontWeight: 700, color: 'white', fontSize: '1.1rem' }}>
              Recruiter Hub
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Hiring Made Easy
            </Typography>
          </Box>
        </motion.div>
      </Toolbar>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mx: 2 }} />

      {/* Main Menu */}
      <List sx={{ px: 2, py: 2 }}>
        <Typography 
          variant="caption" 
          sx={{ 
            px: 2, 
            mb: 1, 
            display: 'block', 
            color: 'rgba(255,255,255,0.5)',
            fontWeight: 600,
            letterSpacing: 1
          }}
        >
          MAIN MENU
        </Typography>
        {mainMenuItems.map((item, index) => (
          <motion.div
            key={item.text}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Tooltip title={item.text} placement="right">
              <ListItem
                button
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  py: 1.2,
                  transition: 'all 0.3s',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    transform: 'translateX(4px)'
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.2)',
                    },
                  },
                  ...(item.highlight && {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                    }
                  })
                }}
              >
                <ListItemIcon
                  sx={{
                    color: location.pathname === item.path || item.highlight ? 'white' : 'rgba(255,255,255,0.7)',
                    minWidth: 40
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.95rem',
                    fontWeight: location.pathname === item.path ? 600 : 500,
                    color: 'white'
                  }}
                />
                {item.badge && (
                  <Chip 
                    label={item.badge} 
                    size="small" 
                    sx={{ 
                      bgcolor: 'error.main',
                      color: 'white',
                      fontWeight: 600,
                      height: 20,
                      fontSize: '0.7rem'
                    }} 
                  />
                )}
              </ListItem>
            </Tooltip>
          </motion.div>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      {/* Bottom Menu */}
      <List sx={{ px: 2, pb: 2 }}>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 2 }} />
        {bottomMenuItems.map((item, index) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
            selected={location.pathname === item.path}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              py: 1,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
              '&.Mui-selected': {
                backgroundColor: 'rgba(255,255,255,0.15)',
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: location.pathname === item.path ? 'white' : 'rgba(255,255,255,0.7)',
                minWidth: 40
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              primaryTypographyProps={{
                fontSize: '0.9rem',
                fontWeight: location.pathname === item.path ? 600 : 400,
                color: 'rgba(255,255,255,0.9)'
              }}
            />
          </ListItem>
        ))}
      </List>

      {/* User Profile Summary */}
      <Box sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.2)' }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: 'primary.light', width: 36, height: 36 }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              R
            </Typography>
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
              Recruiter
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Online
            </Typography>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default RecruiterSidebar;
