const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getPublicStats,
  getMyApplications,
  getJobRecommendations,
  addToWishlist,
  removeFromWishlist,
  getWishlist
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats', protect, getDashboardStats);

// @route   GET /api/dashboard/public-stats
// @desc    Get public statistics for homepage
// @access  Public
router.get('/public-stats', getPublicStats);

// @route   GET /api/dashboard/my-applications
// @desc    Get user's applications
// @access  Private
router.get('/my-applications', protect, getMyApplications);

// @route   GET /api/dashboard/recommendations
// @desc    Get job recommendations
// @access  Private
router.get('/recommendations', protect, getJobRecommendations);

// @route   POST /api/dashboard/wishlist/:jobId
// @desc    Add job to wishlist
// @access  Private
router.post('/wishlist/:jobId', protect, addToWishlist);

// @route   DELETE /api/dashboard/wishlist/:jobId
// @desc    Remove job from wishlist
// @access  Private
router.delete('/wishlist/:jobId', protect, removeFromWishlist);

// @route   GET /api/dashboard/wishlist
// @desc    Get user's wishlist
// @access  Private
router.get('/wishlist', protect, getWishlist);

module.exports = router;
