const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getAdminStats,
  getAllUsers,
  updateUser,
  deleteUser,
  getAllJobs,
  updateJobStatus,
  deleteJob,
  getAnalytics
} = require('../controllers/adminController');

// All admin routes require admin role
router.use(protect);

// Admin dashboard stats
router.get('/stats', (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
  next();
}, getAdminStats);

// User management
router.get('/users', (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
  next();
}, getAllUsers);

router.put('/users/:id', (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
  next();
}, updateUser);

router.delete('/users/:id', (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
  next();
}, deleteUser);

// Job management
router.get('/jobs', (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
  next();
}, getAllJobs);

router.put('/jobs/:id', (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
  next();
}, updateJobStatus);

router.delete('/jobs/:id', (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
  next();
}, deleteJob);

// Analytics
router.get('/analytics', (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
  next();
}, getAnalytics);

module.exports = router;
