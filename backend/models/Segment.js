const mongoose = require('mongoose');

const segmentSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  isDefault: {
    type: Boolean,
    default: false // For 7 default segments
  },
  // Advanced segmentation properties (9+ properties as per ZestPush)
  filters: {
    // User attributes
    userAttributes: {
      type: Map,
      of: String // Custom user attributes
    },
    // State
    states: [String],
    // Country
    countries: [String],
    // Device type
    devices: [String], // mobile, desktop, tablet
    // Operating System
    operatingSystems: [String], // Windows, Android, iOS, macOS, Linux
    // Website/Source
    websites: [String], // For multi-website projects
    // Browser
    browsers: [String], // Chrome, Firefox, Safari, Edge, etc.
    // Date range filters
    dateRange: {
      fromDate: Date,
      toDate: Date,
      betweenDates: {
        start: Date,
        end: Date
      }
    },
    // Tags
    tags: [String],
    // Custom attributes
    customAttributes: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    }
  },
  subscriberCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
segmentSchema.index({ project: 1, isActive: 1 });

module.exports = mongoose.model('Segment', segmentSchema);

