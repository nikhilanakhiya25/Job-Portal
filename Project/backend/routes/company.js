const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Company = require('../models/Company');

// @desc    Create a new company
// @route   POST /api/company
// @access  Private (Admin only)
router.post('/', protect, async (req, res) => {
  try {
    const { name, description, industry, website, location, size, founded } = req.body;

    // Check if company already exists
    const existingCompany = await Company.findOne({ name });
    if (existingCompany) {
      return res.status(400).json({ message: 'Company already exists' });
    }

    const company = new Company({
      name,
      description,
      industry,
      website,
      location,
      size,
      founded,
      createdBy: req.user.id
    });

    const savedCompany = await company.save();
    res.status(201).json(savedCompany);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all companies
// @route   GET /api/company
// @access  Public
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find().populate('createdBy', 'name email');
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single company
// @route   GET /api/company/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).populate('createdBy', 'name email');
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update company
// @route   PUT /api/company/:id
// @access  Private (Admin only)
router.put('/:id', protect, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Check if user is admin or company creator
    if (req.user.role !== 'admin' && company.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedCompany);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete company
// @route   DELETE /api/company/:id
// @access  Private (Admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Check if user is admin or company creator
    if (req.user.role !== 'admin' && company.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Company.findByIdAndDelete(req.params.id);
    res.json({ message: 'Company deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
