const express = require('express');
const router = express.Router();
const { matchSkills, getJobMatches, getMatchStats } = require('../controllers/matchController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/match
// @desc    Match user skills with job requirements
// @access  Private
router.post('/', protect, matchSkills);

// @route   GET /api/match/jobs
// @desc    Get skill match for all jobs
// @access  Private
router.get('/jobs', protect, getJobMatches);

// @route   GET /api/match/stats
// @desc    Get skill match statistics
// @access  Private
router.get('/stats', protect, getMatchStats);

module.exports = router;
