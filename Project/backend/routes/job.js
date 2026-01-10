const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  applyForJob,
  getMyJobs
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getJobs);
router.get('/:id', getJob);

// Protected routes
router.post('/', protect, createJob);
router.put('/:id', protect, updateJob);
router.delete('/:id', protect, deleteJob);

// Job application routes
router.post('/:id/apply', protect, applyForJob);

// Recruiter routes
router.get('/recruiter/my-jobs', protect, getMyJobs);

module.exports = router;
