import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  TextField,
  MenuItem,
  Grid,
  Button,
  IconButton,
  Tooltip,
  Collapse,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Assignment as AssignmentIcon,
  Settings as SettingsIcon,
  Computer as SystemIcon
} from '@mui/icons-material';
import axios from 'axios';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalLogs, setTotalLogs] = useState(0);
  const [filters, setFilters] = useState({
    action: '',
    entityType: '',
    startDate: '',
    endDate: ''
  });
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, [page, rowsPerPage, filters]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page + 1,
        limit: rowsPerPage,
        ...filters
      });
      
      const response = await axios.get(`http://localhost:5000/api/admin/logs?${params}`);
      setLogs(response.data.logs);
      setTotalLogs(response.data.pagination.total);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPage(0);
  };

  const toggleRowExpansion = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const getActionColor = (action) => {
    if (action.includes('blocked') || action.includes('deleted') || action.includes('rejected')) return 'error';
    if (action.includes('approved') || action.includes('created') || action.includes('success')) return 'success';
    if (action.includes('pending')) return 'warning';
    return 'info';
  };

  const getEntityIcon = (entityType) => {
    switch (entityType) {
      case 'user':
        return <PersonIcon />;
      case 'job':
        return <WorkIcon />;
      case 'application':
        return <AssignmentIcon />;
      case 'system':
        return <SystemIcon />;
      default:
        return <SettingsIcon />;
    }
  };

  const formatAction = (action) => {
    return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const actionTypes = [
    'user_registered',
    'user_login',
    'user_logout',
    'user_updated',
    'user_blocked',
    'user_approved',
    'job_posted',
    'job_updated',
    'job_deleted',
    'job_approved',
    'job_rejected',
    'application_submitted',
    'application_status_updated',
    'admin_action',
    'system_event'
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Activity Logs
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Monitor system activity, user actions, and admin operations in real-time.
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              select
              fullWidth
              label="Action Type"
              variant="outlined"
              size="small"
              value={filters.action}
              onChange={(e) => handleFilterChange('action', e.target.value)}
            >
              <MenuItem value="">All Actions</MenuItem>
              {actionTypes.map(action => (
                <MenuItem key={action} value={action}>
                  {formatAction(action)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              select
              fullWidth
              label="Entity Type"
              variant="outlined"
              size="small"
              value={filters.entityType}
              onChange={(e) => handleFilterChange('entityType', e.target.value)}
            >
              <MenuItem value="">All Entities</MenuItem>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="job">Job</MenuItem>
              <MenuItem value="application">Application</MenuItem>
              <MenuItem value="system">System</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              variant="outlined"
              size="small"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              variant="outlined"
              size="small"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchLogs}
              disabled={loading}
              fullWidth
            >
              Refresh
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Logs Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Entity</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No activity logs found
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log, index) => (
                <React.Fragment key={index}>
                  <TableRow>
                    <TableCell>{formatDate(log.createdAt)}</TableCell>
                    <TableCell>
                      <Chip
                        label={formatAction(log.action)}
                        color={getActionColor(log.action)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        {getEntityIcon(log.entityType)}
                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                          {log.entityType}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{log.description}</TableCell>
                    <TableCell>
                      {log.user ? (
                        <Box>
                          <Typography variant="body2">{log.user.name}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {log.user.email}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          System
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {log.metadata && Object.keys(log.metadata).length > 0 && (
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => toggleRowExpansion(index)}
                          >
                            {expandedRow === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={6} sx={{ p: 0, border: 0 }}>
                      <Collapse in={expandedRow === index}>
                        <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Additional Details:
                          </Typography>
                          <List dense>
                            {Object.entries(log.metadata || {}).map(([key, value]) => (
                              <ListItem key={key}>
                                <ListItemText
                                  primary={`${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={totalLogs}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 20, 50, 100]}
        />
      </TableContainer>
    </Box>
  );
};

export default ActivityLogs;
