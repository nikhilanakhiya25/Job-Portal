const Job = require('../models/Job');
const User = require('../models/User');

// @desc    Match user skills with job requirements
// @route   POST /api/match
// @access  Private
const matchSkills = async (req, res) => {
  try {
    const { jobId, userId } = req.body;

    // Get job and user
    const job = await Job.findById(jobId);
    const user = await User.findById(userId || req.user.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user skills
    const userSkills = user.skills || [];

    // Calculate match
    const jobSkills = job.skillsRequired;
    const matchedSkills = userSkills.filter(skill =>
      jobSkills.some(jobSkill =>
        jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(jobSkill.toLowerCase())
      )
    );

    const matchPercentage = jobSkills.length > 0
      ? Math.round((matchedSkills.length / jobSkills.length) * 100)
      : 0;

    // Get missing skills
    const missingSkills = jobSkills.filter(skill =>
      !matchedSkills.some(matchedSkill =>
        matchedSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(matchedSkill.toLowerCase())
      )
    );

    res.json({
      jobId: job._id,
      jobTitle: job.title,
      userId: user._id,
      userName: user.name,
      matchPercentage,
      matchedSkills,
      missingSkills,
      totalJobSkills: jobSkills.length,
      totalUserSkills: userSkills.length
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get skill match for all jobs
// @route   GET /api/match/jobs
// @access  Private
const getJobMatches = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const jobs = await Job.find({});

    const matches = jobs.map(job => {
      const userSkills = user.skills || [];
      const jobSkills = job.skillsRequired;

      const matchedSkills = userSkills.filter(skill =>
        jobSkills.some(jobSkill =>
          jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(jobSkill.toLowerCase())
        )
      );

      const matchPercentage = jobSkills.length > 0
        ? Math.round((matchedSkills.length / jobSkills.length) * 100)
        : 0;

      return {
        job: {
          _id: job._id,
          title: job.title,
          company: job.company,
          skillsRequired: job.skillsRequired
        },
        matchPercentage,
        matchedSkills,
        missingSkills: jobSkills.filter(skill => !matchedSkills.includes(skill))
      };
    });

    // Sort by match percentage (highest first)
    matches.sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.json(matches);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get skill match statistics
// @route   GET /api/match/stats
// @access  Private
const getMatchStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const jobs = await Job.find({});

    const userSkills = user.skills || [];
    let totalMatches = 0;
    let perfectMatches = 0;
    let highMatches = 0;

    jobs.forEach(job => {
      const jobSkills = job.skillsRequired;
      const matchedSkills = userSkills.filter(skill =>
        jobSkills.some(jobSkill =>
          jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(jobSkill.toLowerCase())
        )
      );

      const matchPercentage = jobSkills.length > 0
        ? Math.round((matchedSkills.length / jobSkills.length) * 100)
        : 0;

      if (matchPercentage === 100) perfectMatches++;
      if (matchPercentage >= 70) highMatches++;
      if (matchPercentage > 0) totalMatches++;
    });

    res.json({
      totalJobs: jobs.length,
      totalMatches,
      perfectMatches,
      highMatches: highMatches - perfectMatches,
      userSkillsCount: userSkills.length,
      averageMatch: jobs.length > 0
        ? Math.round((totalMatches / jobs.length) * 100)
        : 0
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  matchSkills,
  getJobMatches,
  getMatchStats
};
