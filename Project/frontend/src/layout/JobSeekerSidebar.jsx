import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Work as WorkIcon,
  Favorite as FavoriteIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 240;

const JobSeekerSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/jobseeker/dashboard' },
    { text: 'Find Jobs', icon: <WorkIcon />, path: '/jobseeker/jobs' },
    { text: 'My Applications', icon: <AssignmentIcon />, path: '/jobseeker/applications' },
    { text: 'Wishlist', icon: <FavoriteIcon />, path: '/jobseeker/wishlist' },
    { text: 'My Profile', icon: <PersonIcon />, path: '/jobseeker/profile' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#f5f5f5',
        },
      }}
    >
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Job Portal
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Job Seeker
        </Typography>
        {user && (
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            Welcome, {user.name}
          </Typography>
        )}
      </Box>

      <Divider />

      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            selected={location.pathname === item.path}
            sx={{
              '&.Mui-selected': {
                backgroundColor: '#e3f2fd',
                '&:hover': {
                  backgroundColor: '#bbdefb',
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: location.pathname === item.path ? '#1976d2' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              sx={{ 
                '& .MuiListItemText-primary': {
                  fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                  color: location.pathname === item.path ? '#1976d2' : 'inherit'
                }
              }}
            />
          </ListItem>
        ))}
      </List>

      <Divider />

      <List>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default JobSeekerSidebar;
