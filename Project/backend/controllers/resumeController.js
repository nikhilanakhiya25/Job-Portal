const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

// Predefined skills list for matching
const SKILLS_LIST = [
  'javascript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust',
  'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring',
  'html', 'css', 'sass', 'bootstrap', 'tailwind',
  'mongodb', 'mysql', 'postgresql', 'redis', 'elasticsearch',
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git',
  'machine learning', 'ai', 'data science', 'tensorflow', 'pytorch',
  'agile', 'scrum', 'kanban', 'leadership', 'communication'
];

// @desc    Upload and parse resume
// @route   POST /api/resume/upload
// @access  Private
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;

    // Parse PDF
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);

    // Extract text content
    const resumeText = data.text.toLowerCase();

    // Extract skills from resume
    const extractedSkills = SKILLS_LIST.filter(skill =>
      resumeText.includes(skill.toLowerCase())
    );

    // Calculate resume score (basic implementation)
    const resumeScore = Math.min(extractedSkills.length * 10, 100);

    // Update user with resume info
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        resumeUrl: req.file.filename,
        skills: extractedSkills
      },
      { new: true }
    ).select('-password');

    // Clean up uploaded file (optional - you might want to keep it)
    // fs.unlinkSync(filePath);

    res.json({
      message: 'Resume uploaded successfully',
      user,
      extractedSkills,
      resumeScore,
      resumeText: resumeText.substring(0, 500) + '...' // First 500 chars
    });

  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(500).json({ message: 'Error processing resume' });
  }
};

// @desc    Get user's resume info
// @route   GET /api/resume
// @access  Private
const getResume = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('resumeUrl skills');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user's resume
// @route   DELETE /api/resume
// @access  Private
const deleteResume = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.resumeUrl) {
      // Delete file from filesystem
      const filePath = path.join(__dirname, '../uploads', user.resumeUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Update user
      user.resumeUrl = null;
      user.skills = [];
      await user.save();
    }

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const analyzeResume = (req, res) => {
  const score = Math.floor(Math.random() * 20) + 70;
  res.json({ resumeScore: score });
};

module.exports = {
  uploadResume,
  getResume,
  deleteResume,
  analyzeResume
};
