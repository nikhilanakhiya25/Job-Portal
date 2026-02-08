const express = require('express');
const router = express.Router();
const { createPaymentIntent, confirmPayment, getPaymentHistory } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/payment/create-intent
// @desc    Create payment intent for premium job posting
// @access  Private
router.post('/create-intent', protect, createPaymentIntent);

// @route   POST /api/payment/confirm
// @desc    Confirm payment and upgrade job
// @access  Private
router.post('/confirm', protect, confirmPayment);

// @route   GET /api/payment/history
// @desc    Get user's payment history
// @access  Private
router.get('/history', protect, getPaymentHistory);

module.exports = router;
