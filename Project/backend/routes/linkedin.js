const express = require('express');
const router = express.Router();
const { linkedInAuth, getLinkedInProfile } = require('../controllers/linkedinController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/auth/linkedin
// @desc    Authenticate with LinkedIn
// @access  Public
router.post('/linkedin', linkedInAuth);

// @route   GET /api/auth/linkedin/profile
// @desc    Get LinkedIn profile data
// @access  Private
router.get('/linkedin/profile', protect, getLinkedInProfile);

module.exports = router;
