const Job = require('../models/Job');
const User = require('../models/User');
const Company = require('../models/Company');
const Application = require('../models/Application');
const { sendEmail } = require('../utils/emailService');

// @desc    Get recruiter's company profile
// @route   GET /api/recruiter/company
// @access  Private (Recruiters only)
const getCompany = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('company');
    
    if (!user.company) {
      return res.status(404).json({ message: 'No company profile found' });
    }

    res.json(user.company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create or update company profile
// @route   POST /api/recruiter/company
// @access  Private (Recruiters only)
const createOrUpdateCompany = async (req, res) => {
  try {
    const { name, description, industry, website, location, size, founded } = req.body;

    let company = await Company.findOne({ createdBy: req.user.id });

    if (company) {
      // Update existing company
      company.name = name || company.name;
      company.description = description || company.description;
      company.industry = industry || company.industry;
      company.website = website || company.website;
      company.location = location || company.location;
      company.size = size || company.size;
      company.founded = founded || company.founded;
      
      await company.save();
    } else {
      // Create new company
      company = await Company.create({
        name,
        description,
        industry,
        website,
        location,
        size,
        founded,
        createdBy: req.user.id
      });

      // Link company to user
      await User.findByIdAndUpdate(req.user.id, { company: company._id });
    }

    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recruiter's jobs with analytics
// @route   GET /api/recruiter/jobs
// @access  Private (Recruiters only)
const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id })
      .populate('applicants.user', 'name email skills resumeUrl')
      .sort({ createdAt: -1 });

    // Add analytics to each job
    const jobsWithAnalytics = jobs.map(job => {
      const totalApplicants = job.applicants.length;
      const shortlisted = job.applicants.filter(a => a.status === 'shortlisted').length;
      const rejected = job.applicants.filter(a => a.status === 'rejected').length;
      const pending = job.applicants.filter(a => a.status === 'pending').length;

      return {
        ...job.toObject(),
        analytics: {
          totalApplicants,
          shortlisted,
          rejected,
          pending,
          conversionRate: totalApplicants > 0 ? ((shortlisted / totalApplicants) * 100).toFixed(1) : 0
        }
      };
    });

    res.json(jobsWithAnalytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a job posting
// @route   POST /api/recruiter/jobs
// @access  Private (Recruiters only)
const createJob = async (req, res) => {
  try {
    const { title, description, skillsRequired, experience, salary, location } = req.body;

    // Check if recruiter has a company
    const user = await User.findById(req.user.id).populate('company');
    
    const job = await Job.create({
      title,
      description,
      skillsRequired,
      experience,
      salary,
      location,
      company: user.company ? user.company.name : 'Unknown Company',
      postedBy: req.user.id
    });

    // Add job to company's jobs array if company exists
    if (user.company) {
      await Company.findByIdAndUpdate(user.company._id, {
        $push: { jobs: job._id }
      });
    }

    const populatedJob = await Job.findById(job._id)
      .populate('postedBy', 'name email')
      .populate('applicants.user', 'name email skills');

    res.status(201).json(populatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a job
// @route   PUT /api/recruiter/jobs/:id
// @access  Private (Recruiters only)
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user is the job poster
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to update this job' });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('postedBy', 'name email')
     .populate('applicants.user', 'name email skills');

    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a job
// @route   DELETE /api/recruiter/jobs/:id
// @access  Private (Recruiters only)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user is the job poster
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this job' });
    }

    // Delete all applications for this job
    await Application.deleteMany({ job: req.params.id });

    // Remove job from company's jobs array
    await Company.findByIdAndUpdate(job.postedBy, {
      $pull: { jobs: job._id }
    });

    await Job.findByIdAndDelete(req.params.id);

    res.json({ message: 'Job removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get applicants for a specific job
// @route   GET /api/recruiter/jobs/:id/applicants
// @access  Private (Recruiters only)
const getJobApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate({
        path: 'applicants.user',
        select: 'name email skills resumeUrl'
      });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user is the job poster
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to view these applicants' });
    }

    // Calculate match scores for each applicant
    const applicantsWithScores = job.applicants.map(applicant => {
      const matchScore = calculateMatchScore(job, applicant.user);
      return {
        ...applicant.toObject(),
        matchScore,
        skillGap: matchScore.skillGap
      };
    });

    // Sort by match score (highest first)
    applicantsWithScores.sort((a, b) => b.matchScore.percentage - a.matchScore.percentage);

    res.json({
      job: {
        _id: job._id,
        title: job.title,
        company: job.company,
        skillsRequired: job.skillsRequired
      },
      applicants: applicantsWithScores
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update applicant status
// @route   PUT /api/recruiter/applicants/:applicationId/status
// @access  Private (Recruiters only)
const updateApplicantStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId)
      .populate('applicant', 'name email')
      .populate('job', 'title company');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Verify the recruiter owns the job
    const job = await Job.findById(application.job._id);
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to update this application' });
    }

    // Update status
    application.status = status;
    if (notes) application.notes = notes;
    await application.save();

    // Update job's applicants array
    await Job.findOneAndUpdate(
      { _id: application.job._id, 'applicants.user': application.applicant._id },
      { $set: { 'applicants.$.status': status } }
    );

    // Send email notification to candidate
    const emailSubject = `Application Status Update - ${application.job.title}`;
    const emailBody = `
      Dear ${application.applicant.name},

      Your application for the position of "${application.job.title}" at ${application.job.company} has been ${status}.

      ${notes ? `Notes: ${notes}` : ''}

      ${status === 'shortlisted' ? 'Congratulations! You have been shortlisted for the next round. We will contact you soon with further details.' : ''}
      ${status === 'rejected' ? 'We appreciate your interest, but we have decided to move forward with other candidates at this time.' : ''}
      ${status === 'accepted' ? 'Congratulations! We are pleased to offer you the position. Our HR team will contact you with the offer details.' : ''}

      Best regards,
      Hiring Team
    `;

    await sendEmail({
      to: application.applicant.email,
      subject: emailSubject,
      text: emailBody
    });

    res.json({
      message: `Application ${status} successfully`,
      application: {
        _id: application._id,
        status: application.status,
        applicant: application.applicant,
        job: application.job
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recruiter dashboard analytics
// @route   GET /api/recruiter/analytics
// @access  Private (Recruiters only)
const getAnalytics = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id });
    const totalJobs = jobs.length;
    
    // Get all applications for recruiter's jobs
    const jobIds = jobs.map(job => job._id);
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('applicant', 'name email skills')
      .populate('job', 'title');

    const totalApplications = applications.length;
    const shortlisted = applications.filter(a => a.status === 'shortlisted').length;
    const rejected = applications.filter(a => a.status === 'rejected').length;
    const pending = applications.filter(a => a.status === 'pending').length;
    const accepted = applications.filter(a => a.status === 'accepted').length;

    // Job performance data
    const jobPerformance = jobs.map(job => {
      const jobApps = applications.filter(a => a.job._id.toString() === job._id.toString());
      return {
        jobId: job._id,
        title: job.title,
        totalApplicants: jobApps.length,
        shortlisted: jobApps.filter(a => a.status === 'shortlisted').length,
        rejected: jobApps.filter(a => a.status === 'rejected').length,
        pending: jobApps.filter(a => a.status === 'pending').length,
        postedDate: job.createdAt
      };
    });

    // Recent applications
    const recentApplications = applications
      .sort((a, b) => b.appliedAt - a.appliedAt)
      .slice(0, 5)
      .map(app => ({
        _id: app._id,
        applicantName: app.applicant.name,
        jobTitle: app.job.title,
        status: app.status,
        appliedAt: app.appliedAt
      }));

    res.json({
      overview: {
        totalJobs,
        totalApplications,
        shortlisted,
        rejected,
        pending,
        accepted,
        conversionRate: totalApplications > 0 ? ((shortlisted / totalApplications) * 100).toFixed(1) : 0
      },
      jobPerformance,
      recentApplications
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Calculate match score between job and candidate
// @route   GET /api/recruiter/match-score/:jobId/:applicantId
// @access  Private (Recruiters only)
const getMatchScore = async (req, res) => {
  try {
    const { jobId, applicantId } = req.params;

    const job = await Job.findById(jobId);
    const applicant = await User.findById(applicantId).select('name skills resumeUrl');

    if (!job || !applicant) {
      return res.status(404).json({ message: 'Job or applicant not found' });
    }

    const matchScore = calculateMatchScore(job, applicant);

    res.json({
      job: {
        _id: job._id,
        title: job.title,
        skillsRequired: job.skillsRequired
      },
      applicant: {
        _id: applicant._id,
        name: applicant.name,
        skills: applicant.skills
      },
      matchScore
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to calculate match score
const calculateMatchScore = (job, applicant) => {
  if (!applicant.skills || applicant.skills.length === 0) {
    return {
      percentage: 0,
      matchedSkills: [],
      missingSkills: job.skillsRequired || [],
      skillGap: job.skillsRequired || []
    };
  }

  const requiredSkills = job.skillsRequired || [];
  const applicantSkills = applicant.skills.map(skill => skill.toLowerCase());

  const matchedSkills = requiredSkills.filter(skill => 
    applicantSkills.some(applicantSkill => 
      applicantSkill.includes(skill.toLowerCase()) || 
      skill.toLowerCase().includes(applicantSkill)
    )
  );

  const missingSkills = requiredSkills.filter(skill => 
    !applicantSkills.some(applicantSkill => 
      applicantSkill.includes(skill.toLowerCase()) || 
      skill.toLowerCase().includes(applicantSkill)
    )
  );

  const percentage = requiredSkills.length > 0 
    ? Math.round((matchedSkills.length / requiredSkills.length) * 100) 
    : 0;

  return {
    percentage,
    matchedSkills,
    missingSkills,
    skillGap: missingSkills
  };
};

// @desc    Bulk update applicant statuses
// @route   PUT /api/recruiter/bulk-update-status
// @access  Private (Recruiters only)
const bulkUpdateStatus = async (req, res) => {
  try {
    const { applicationIds, status, notes } = req.body;

    const results = await Promise.all(
      applicationIds.map(async (appId) => {
        try {
          const application = await Application.findById(appId)
            .populate('applicant', 'name email')
            .populate('job', 'title company postedBy');

          if (!application) {
            return { appId, success: false, error: 'Application not found' };
          }

          // Verify ownership
          if (application.job.postedBy.toString() !== req.user.id) {
            return { appId, success: false, error: 'Not authorized' };
          }

          // Update status
          application.status = status;
          if (notes) application.notes = notes;
          await application.save();

          // Update job's applicants array
          await Job.findOneAndUpdate(
            { _id: application.job._id, 'applicants.user': application.applicant._id },
            { $set: { 'applicants.$.status': status } }
          );

          // Send email notification
          const emailSubject = `Application Status Update - ${application.job.title}`;
          const emailBody = `
            Dear ${application.applicant.name},

            Your application for "${application.job.title}" at ${application.job.company} has been ${status}.

            ${notes ? `Notes: ${notes}` : ''}

            Best regards,
            Hiring Team
          `;

          await sendEmail({
            to: application.applicant.email,
            subject: emailSubject,
            text: emailBody
          });

          return { appId, success: true };
        } catch (error) {
          return { appId, success: false, error: error.message };
        }
      })
    );

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    res.json({
      message: `Bulk update completed: ${successful} successful, ${failed} failed`,
      results
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};
