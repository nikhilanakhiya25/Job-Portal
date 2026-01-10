const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  matchScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['Applied', 'Under Review', 'Shortlisted', 'Rejected', 'Accepted'],
    default: 'Applied'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate applications
applicationSchema.index({ job: 1, user: 1 }, { unique: true });

// Index for efficient queries
applicationSchema.index({ user: 1, status: 1 });
applicationSchema.index({ job: 1, status: 1 });
applicationSchema.index({ matchScore: -1 });

module.exports = mongoose.model('Application', applicationSchema);
