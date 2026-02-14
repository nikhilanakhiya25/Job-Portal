import React, { useEffect, useState } from 'react';
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
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Alert,
  IconButton,
  Tooltip,
  TablePagination,
  MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PremiumUpgrade from './PremiumUpgrade';


export default function ManageJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editDialog, setEditDialog] = useState({ open: false, job: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, job: null });
  const [premiumDialog, setPremiumDialog] = useState({ open: false, job: null });
  const [approvalDialog, setApprovalDialog] = useState({ open: false, job: null, action: '' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalJobs, setTotalJobs] = useState(0);
  const [filters, setFilters] = useState({
    approvalStatus: '',
    search: ''
  });

  useEffect(() => {
    fetchJobs();
  }, [page, rowsPerPage, filters]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page + 1,
        limit: rowsPerPage,
        ...filters
      });
      
      const response = await axios.get(`http://localhost:5000/api/admin/jobs?${params}`);
      setJobs(response.data.jobs);
      setTotalJobs(response.data.pagination.total);
    } catch (err) {
      setError('Failed to fetch jobs');
      console.error('Error fetching jobs:', err);
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


  const handleEdit = (job) => {
    setEditDialog({ open: true, job: { ...job } });
  };

  const handleEditSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/jobs/${editDialog.job._id}`, editDialog.job, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditDialog({ open: false, job: null });
      fetchJobs();
    } catch (err) {
      setError('Failed to update job');
      console.error('Error updating job:', err);
    }
  };

  const handleDelete = (job) => {
    setDeleteDialog({ open: true, job });
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/jobs/${deleteDialog.job._id}`);
      setDeleteDialog({ open: false, job: null });
      fetchJobs();
    } catch (err) {
      setError('Failed to delete job');
      console.error('Error deleting job:', err);
    }
  };

  const handleApprovalAction = (job, action) => {
    setApprovalDialog({ open: true, job, action });
  };

  const handleApprovalConfirm = async () => {
    try {
      const newStatus = approvalDialog.action === 'approve' ? 'approved' : 'rejected';
      await axios.put(`http://localhost:5000/api/admin/jobs/${approvalDialog.job._id}`, {
        approvalStatus: newStatus
      });
      setApprovalDialog({ open: false, job: null, action: '' });
      fetchJobs();
    } catch (err) {
      setError(`Failed to ${approvalDialog.action} job`);
      console.error(`Error ${approvalDialog.action}ing job:`, err);
    }
  };

  const getApprovalStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getApprovalStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon />;
      case 'rejected':
        return <CancelIcon />;
      case 'pending':
        return <PendingIcon />;
      default:
        return null;
    }
  };


  const handleEditChange = (field, value) => {
    setEditDialog(prev => ({
      ...prev,
      job: { ...prev.job, [field]: value }
    }));
  };

  if (loading) {
    return <Typography>Loading jobs...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manage Jobs
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Approve, reject, or delete job listings. Monitor job posting activity and manage approvals.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Search"
              variant="outlined"
              size="small"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search by title or company"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              select
              fullWidth
              label="Approval Status"
              variant="outlined"
              size="small"
              value={filters.approvalStatus}
              onChange={(e) => handleFilterChange('approvalStatus', e.target.value)}
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchJobs}
              disabled={loading}
            >
              Refresh
            </Button>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/admin/post-job')}
              fullWidth
            >
              Post New Job
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Posted By</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Salary</TableCell>
                <TableCell>Approval Status</TableCell>
                <TableCell>Premium</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : jobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No jobs found
                  </TableCell>
                </TableRow>
              ) : (
                jobs.map((job) => (
                  <TableRow key={job._id}>
                    <TableCell>{job.title}</TableCell>
                    <TableCell>{job.company}</TableCell>
                    <TableCell>{job.postedBy?.name || 'Unknown'}</TableCell>
                    <TableCell>{job.location}</TableCell>
                    <TableCell>{job.salary}</TableCell>
                    <TableCell>
                      <Chip
                        icon={getApprovalStatusIcon(job.approvalStatus)}
                        label={job.approvalStatus || 'pending'}
                        color={getApprovalStatusColor(job.approvalStatus)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {job.isPremium ? (
                        <Chip
                          icon={<StarIcon />}
                          label="Premium"
                          color="warning"
                          size="small"
                        />
                      ) : (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<StarIcon />}
                          onClick={() => setPremiumDialog({ open: true, job })}
                        >
                          Upgrade
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        {job.approvalStatus === 'pending' && (
                          <>
                            <Tooltip title="Approve Job">
                              <IconButton 
                                onClick={() => handleApprovalAction(job, 'approve')} 
                                color="success"
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Reject Job">
                              <IconButton 
                                onClick={() => handleApprovalAction(job, 'reject')} 
                                color="error"
                              >
                                <CancelIcon />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                        <Tooltip title="Edit">
                          <IconButton onClick={() => handleEdit(job)} color="primary">
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton onClick={() => handleDelete(job)} color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>

          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={totalJobs}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>


      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, job: null })} maxWidth="md" fullWidth>
        <DialogTitle>Edit Job</DialogTitle>
        <DialogContent>
          {editDialog.job && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Job Title"
                  value={editDialog.job.title || ''}
                  onChange={(e) => handleEditChange('title', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company"
                  value={editDialog.job.company || ''}
                  onChange={(e) => handleEditChange('company', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location"
                  value={editDialog.job.location || ''}
                  onChange={(e) => handleEditChange('location', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Salary"
                  value={editDialog.job.salary || ''}
                  onChange={(e) => handleEditChange('salary', e.target.value)}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, job: null })}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, job: null })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the job "{deleteDialog.job?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, job: null })}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Approval/Rejection Dialog */}
      <Dialog open={approvalDialog.open} onClose={() => setApprovalDialog({ open: false, job: null, action: '' })}>
        <DialogTitle>
          {approvalDialog.action === 'approve' ? 'Approve Job' : 'Reject Job'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {approvalDialog.action} the job "{approvalDialog.job?.title}"?
            {approvalDialog.action === 'reject' && ' This job will not be visible to users.'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApprovalDialog({ open: false, job: null, action: '' })}>
            Cancel
          </Button>
          <Button 
            onClick={handleApprovalConfirm} 
            color={approvalDialog.action === 'approve' ? 'success' : 'error'}
            variant="contained"
          >
            {approvalDialog.action === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Premium Upgrade Dialog */}
      {premiumDialog.job && (
        <PremiumUpgrade
          open={premiumDialog.open}
          onClose={() => setPremiumDialog({ open: false, job: null })}
          jobId={premiumDialog.job._id}
          jobTitle={premiumDialog.job.title}
        />
      )}
    </Box>
  );
}
