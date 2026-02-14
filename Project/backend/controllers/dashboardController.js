 const Job = require('../models/Job');
const User = require('../models/User');
const Application = require('../models/Application');

// @desc    Get public statistics for homepage
// @route   GET /api/dashboard/public-stats
// @access  Public
const getPublicStats = async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments();
    const totalCompanies = await Job.distinct('company').then(companies => companies.length);
    const totalJobSeekers = await User.countDocuments({ role: 'jobseeker' });
    const totalApplications = await Application.countDocuments();

    // Calculate success rate (applications that are shortlisted or accepted)
    const successfulApplications = await Application.countDocuments({
      status: { $in: ['shortlisted', 'accepted'] }
    });
    const successRate = totalApplications > 0 ? Math.round((successfulApplications / totalApplications) * 100) : 95;

    res.json({
      totalJobs: totalJobs || 10000,
      totalCompanies: totalCompanies || 5000,
      totalJobSeekers: totalJobSeekers || 50000,
      successRate: successRate || 95
    });
  } catch (error) {
    console.error('Error fetching public stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
const { sendApplicationStatusEmail } = require('../utils/emailService');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private (Admin only)
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'active' });

    res.json({
      totalUsers,
      totalJobs,
      totalApplications,
      activeJobs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's applications
// @route   GET /api/dashboard/my-applications
// @access  Private
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user.id })
      .populate('job', 'title company location')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update application status
// @route   PUT /api/dashboard/applications/:id
// @access  Private (Admin/Recruiter only)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id).populate('user job');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user is admin or job poster
    const job = await Job.findById(application.job);
    if (req.user.role !== 'admin' && job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    application.status = status;
    await application.save();

    // Send email notification
    await sendApplicationStatusEmail(application.user.email, application.job.title, status);

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get job recommendations for user
// @route   GET /api/dashboard/recommendations
// @access  Private
const getJobRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.skills || user.skills.length === 0) {
      return res.json([]);
    }

    const recommendations = await Job.find({
      skillsRequired: { $in: user.skills },
      status: 'active'
    }).limit(10);

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add job to wishlist
// @route   POST /api/dashboard/wishlist/:jobId
// @access  Private
const addToWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.wishlist) {
      user.wishlist = [];
    }

    if (!user.wishlist.includes(req.params.jobId)) {
      user.wishlist.push(req.params.jobId);
      await user.save();
    }

    res.json({ message: 'Added to wishlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove job from wishlist
// @route   DELETE /api/dashboard/wishlist/:jobId
// @access  Private
const removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.jobId);
    await user.save();

    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's wishlist
// @route   GET /api/dashboard/wishlist
// @access  Private
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getPublicStats,
  getMyApplications,
  updateApplicationStatus,
  getJobRecommendations,
  addToWishlist,
  removeFromWishlist,
  getWishlist
};
