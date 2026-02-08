const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');
const Job = require('../models/Job');

// Create payment intent for premium job posting
const createPaymentIntent = async (req, res) => {
  try {
    const { jobId, amount } = req.body;
    const userId = req.user.id;

    // Verify job exists and belongs to user
    const job = await Job.findOne({ _id: jobId, postedBy: userId });
    if (!job) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      metadata: {
        jobId: jobId,
        userId: userId
      }
    });

    // Save payment record
    const payment = new Payment({
      user: userId,
      job: jobId,
      stripePaymentIntentId: paymentIntent.id,
      amount: amount
    });
    await payment.save();

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ message: 'Failed to create payment intent' });
  }
};

// Confirm payment and upgrade job to premium
const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    const userId = req.user.id;

    // Find payment record
    const payment = await Payment.findOne({
      stripePaymentIntentId: paymentIntentId,
      user: userId
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Update payment status
      payment.status = 'succeeded';
      await payment.save();

      // Upgrade job to premium
      const job = await Job.findById(payment.job);
      if (job) {
        job.isPremium = true;
        job.premiumExpiresAt = new Date(Date.now() + payment.premiumDuration * 24 * 60 * 60 * 1000);
        await job.save();
      }

      res.json({ message: 'Payment confirmed and job upgraded to premium' });
    } else {
      payment.status = paymentIntent.status;
      await payment.save();
      res.status(400).json({ message: 'Payment not successful' });
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ message: 'Failed to confirm payment' });
  }
};

// Get user's payment history
const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const payments = await Payment.find({ user: userId })
      .populate('job', 'title company')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ message: 'Failed to fetch payment history' });
  }
};

module.exports = {
  createPaymentIntent,
  confirmPayment,
  getPaymentHistory
};
