import React from "react";
import { List, ListItem, ListItemText, ListItemIcon, Divider, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Work as WorkIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  PersonAdd as PersonAddIcon,
  Business as BusinessIcon,
  Favorite as FavoriteIcon
} from "@mui/icons-material";

const Sidebar = ({ user }) => {
  return (
    <List>
      {/* Common Routes for all authenticated users */}
      <ListItem button component={Link} to="/dashboard">
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>

      <ListItem button component={Link} to="/jobs">
        <ListItemIcon>
          <WorkIcon />
        </ListItemIcon>
        <ListItemText primary="Browse Jobs" />
      </ListItem>

      <ListItem button component={Link} to="/wishlist">
        <ListItemIcon>
          <FavoriteIcon />
        </ListItemIcon>
        <ListItemText primary="Wishlist" />
      </ListItem>

      <Divider sx={{ my: 1 }} />

      {/* Job Seeker Routes */}
      {user?.role === "jobseeker" && (
        <>
          <Typography variant="caption" color="textSecondary" sx={{ px: 2, py: 1, display: 'block' }}>
            JOB SEEKER
          </Typography>
          <ListItem button component={Link} to="/my-jobs">
            <ListItemIcon>
              <BusinessIcon />
            </ListItemIcon>
            <ListItemText primary="My Applications" />
          </ListItem>
        </>
      )}

      {/* Recruiter Routes */}
      {user?.role === "recruiter" && (
        <>
          <Typography variant="caption" color="textSecondary" sx={{ px: 2, py: 1, display: 'block' }}>
            RECRUITER
          </Typography>
          <ListItem button component={Link} to="/admin/post-job">
            <ListItemIcon>
              <PersonAddIcon />
            </ListItemIcon>
            <ListItemText primary="Post Job" />
          </ListItem>
          <ListItem button component={Link} to="/admin/manage-jobs">
            <ListItemIcon>
              <WorkIcon />
            </ListItemIcon>
            <ListItemText primary="Manage Jobs" />
          </ListItem>
          <ListItem button component={Link} to="/admin/view-applicants">
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="View Applicants" />
          </ListItem>
        </>
      )}

      {/* Admin Routes */}
      {user?.role === "admin" && (
        <>
          <Typography variant="caption" color="textSecondary" sx={{ px: 2, py: 1, display: 'block' }}>
            ADMIN PANEL
          </Typography>
          <ListItem button component={Link} to="/admin">
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Admin Dashboard" />
          </ListItem>
          <ListItem button component={Link} to="/admin/manage-users">
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Manage Users" />
          </ListItem>
          <ListItem button component={Link} to="/admin/manage-jobs">
            <ListItemIcon>
              <WorkIcon />
            </ListItemIcon>
            <ListItemText primary="Manage Jobs" />
          </ListItem>
          <ListItem button component={Link} to="/admin/view-applicants">
            <ListItemIcon>
              <PersonAddIcon />
            </ListItemIcon>
            <ListItemText primary="View Applicants" />
          </ListItem>
          <ListItem button component={Link} to="/admin/analytics">
            <ListItemIcon>
              <AssessmentIcon />
            </ListItemIcon>
            <ListItemText primary="Analytics" />
          </ListItem>
          <ListItem button component={Link} to="/admin/activity-logs">
            <ListItemIcon>
              <TimelineIcon />
            </ListItemIcon>
            <ListItemText primary="Activity Logs" />
          </ListItem>
        </>
      )}

    </List>
  );
};

export default Sidebar;
