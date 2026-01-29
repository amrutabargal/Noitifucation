const mongoose = require('mongoose');

const inAppMessageSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  icon: {
    type: String
  },
  // Priority/order for display
  priority: {
    type: Number,
    default: 0 // Higher number = higher priority
  },
  // Display settings
  displaySettings: {
    showInBell: {
      type: Boolean,
      default: true
    },
    showAsBanner: {
      type: Boolean,
      default: false
    },
    autoDismiss: {
      type: Boolean,
      default: false
    },
    dismissAfter: {
      type: Number, // seconds
      default: 5
    }
  },
  // Target audience
  targetAudience: {
    segments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Segment'
    }],
    browsers: [String],
    countries: [String],
    devices: [String]
  },
  // Status
  status: {
    type: String,
    enum: ['draft', 'active', 'expired', 'archived'],
    default: 'draft'
  },
  // Schedule
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  // Statistics
  stats: {
    views: {
      type: Number,
      default: 0
    },
    clicks: {
      type: Number,
      default: 0
    }
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
inAppMessageSchema.index({ project: 1, status: 1, priority: -1 });
inAppMessageSchema.index({ project: 1, 'displaySettings.showInBell': 1 });

module.exports = mongoose.model('InAppMessage', inAppMessageSchema);

