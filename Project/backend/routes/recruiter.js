const express = require('express');
const router = express.Router();
const {
  getCompany,
  createOrUpdateCompany,
  getMyJobs,
  createJob,
  updateJob,
  deleteJob,
  getJobApplicants,
  updateApplicantStatus,
  getAnalytics,
  getMatchScore,
  bulkUpdateStatus
} = require('../controllers/recruiterController');
const { protect } = require('../middleware/authMiddleware');

// Company management routes
router.get('/company', protect, getCompany);
router.post('/company', protect, createOrUpdateCompany);

// Job management routes
router.get('/jobs', protect, getMyJobs);
router.post('/jobs', protect, createJob);
router.put('/jobs/:id', protect, updateJob);
router.delete('/jobs/:id', protect, deleteJob);

// Applicant management routes
router.get('/jobs/:id/applicants', protect, getJobApplicants);
router.put('/applicants/:applicationId/status', protect, updateApplicantStatus);
router.post('/bulk-update-status', protect, bulkUpdateStatus);

// Analytics routes
router.get('/analytics', protect, getAnalytics);
router.get('/match-score/:jobId/:applicantId', protect, getMatchScore);

module.exports = router;
