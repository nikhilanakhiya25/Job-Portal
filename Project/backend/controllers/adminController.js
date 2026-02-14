const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    const activeJobs = await Job.countDocuments({ approvalStatus: 'approved' });
    const pendingJobs = await Job.countDocuments({ approvalStatus: 'pending' });
    const blockedUsers = await User.countDocuments({ accountStatus: 'blocked' });
    const pendingUsers = await User.countDocuments({ accountStatus: 'pending' });

    // Get recent activity count (last 24 hours)
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentActivity = await ActivityLog.countDocuments({
      createdAt: { $gte: last24Hours }
    });

    res.json({
      totalUsers,
      totalJobs,
      totalApplications,
      activeJobs,
      pendingJobs,
      blockedUsers,
      pendingUsers,
      recentActivity
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all users with filtering and pagination
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const { role, accountStatus, search, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    if (role) query.role = role;
    if (accountStatus) query.accountStatus = accountStatus;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user status (approve/block)
// @route   PUT /api/admin/users/:id
// @access  Private (Admin only)
const updateUser = async (req, res) => {
  try {
    const { accountStatus } = req.body;
    const userId = req.params.id;

    if (!['active', 'blocked', 'pending'].includes(accountStatus)) {
      return res.status(400).json({ message: 'Invalid account status' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { accountStatus },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Log the activity
    await ActivityLog.create({
      user: req.user.id,
      action: accountStatus === 'blocked' ? 'user_blocked' : 'user_approved',
      description: `Admin ${accountStatus === 'blocked' ? 'blocked' : 'approved'} user ${user.email}`,
      entityType: 'user',
      entityId: user._id,
      metadata: { previousStatus: user.accountStatus, newStatus: accountStatus }
    });

    res.json({ message: `User ${accountStatus === 'blocked' ? 'blocked' : 'approved'} successfully`, user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting admin users
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin users' });
    }

    await User.findByIdAndDelete(req.params.id);

    // Log the activity
    await ActivityLog.create({
      user: req.user.id,
      action: 'user_deleted',
      description: `Admin deleted user ${user.email}`,
      entityType: 'user',
      entityId: user._id,
      metadata: { deletedUser: user.email, role: user.role }
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all jobs with filtering and pagination
// @route   GET /api/admin/jobs
// @access  Private (Admin only)
const getAllJobs = async (req, res) => {
  try {
    const { approvalStatus, search, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    if (approvalStatus) query.approvalStatus = approvalStatus;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const jobs = await Job.find(query)
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(query);

    res.json({
      jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update job approval status
// @route   PUT /api/admin/jobs/:id
// @access  Private (Admin only)
const updateJobStatus = async (req, res) => {
  try {
    const { approvalStatus } = req.body;
    const jobId = req.params.id;

    if (!['approved', 'pending', 'rejected'].includes(approvalStatus)) {
      return res.status(400).json({ message: 'Invalid approval status' });
    }

    const job = await Job.findByIdAndUpdate(
      jobId,
      { approvalStatus },
      { new: true }
    ).populate('postedBy', 'name email');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Log the activity
    await ActivityLog.create({
      user: req.user.id,
      action: approvalStatus === 'approved' ? 'job_approved' : 'job_rejected',
      description: `Admin ${approvalStatus} job "${job.title}"`,
      entityType: 'job',
      entityId: job._id,
      metadata: { 
        jobTitle: job.title, 
        company: job.company,
        previousStatus: job.approvalStatus,
        newStatus: approvalStatus 
      }
    });

    res.json({ 
      message: `Job ${approvalStatus} successfully`, 
      job 
    });
  } catch (error) {
    console.error('Error updating job status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete job
// @route   DELETE /api/admin/jobs/:id
// @access  Private (Admin only)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    await Job.findByIdAndDelete(req.params.id);

    // Log the activity
    await ActivityLog.create({
      user: req.user.id,
      action: 'job_deleted',
      description: `Admin deleted job "${job.title}"`,
      entityType: 'job',
      entityId: job._id,
      metadata: { jobTitle: job.title, company: job.company }
    });

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get platform analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin only)
const getAnalytics = async (req, res) => {
  try {
    // Skill demand analytics
    const skillDemand = await Job.aggregate([
      { $match: { approvalStatus: 'approved' } },
      { $unwind: '$skillsRequired' },
      { $group: { _id: '$skillsRequired', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // User growth over last 30 days
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const userGrowth = await User.aggregate([
      { 
        $match: { 
          createdAt: { $gte: last30Days } 
        } 
      },
      {
        $group: {
          _id: { 
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } 
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Job posting trends
    const jobTrends = await Job.aggregate([
      { 
        $match: { 
          createdAt: { $gte: last30Days } 
        } 
      },
      {
        $group: {
          _id: { 
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } 
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Application statistics
    const applicationStats = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // User role distribution
    const userRoles = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      skillDemand: skillDemand.map(item => ({ skill: item._id, count: item.count })),
      userGrowth: userGrowth.map(item => ({ date: item._id, count: item.count })),
      jobTrends: jobTrends.map(item => ({ date: item._id, count: item.count })),
      applicationStats: applicationStats.map(item => ({ status: item._id, count: item.count })),
      userRoles: userRoles.map(item => ({ role: item._id, count: item.count }))
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get activity logs with filtering and pagination
// @route   GET /api/admin/logs
// @access  Private (Admin only)
const getActivityLogs = async (req, res) => {
  try {
    const { action, entityType, startDate, endDate, page = 1, limit = 20 } = req.query;
    
    let query = {};
    
    if (action) query.action = action;
    if (entityType) query.entityType = entityType;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const logs = await ActivityLog.find(query)
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ActivityLog.countDocuments(query);

    res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  updateUser,
  deleteUser,
  getAllJobs,
  updateJobStatus,
  deleteJob,
  getAnalytics,
  getActivityLogs
};
