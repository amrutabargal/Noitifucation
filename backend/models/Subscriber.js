const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  endpoint: {
    type: String,
    required: true,
    unique: true
  },
  keys: {
    p256dh: {
      type: String,
      required: true
    },
    auth: {
      type: String,
      required: true
    }
  },
  userAgent: {
    type: String
  },
  browser: {
    type: String
  },
  os: {
    type: String
  },
  country: {
    type: String
  },
  state: {
    type: String // State/Province for segmentation
  },
  city: {
    type: String
  },
  device: {
    type: String, // mobile, desktop, tablet
    enum: ['mobile', 'desktop', 'tablet', 'unknown']
  },
  website: {
    type: String // Source website for multi-website projects
  },
  timezone: {
    type: String
  },
  tags: [{
    type: String
  }],
  attributes: {
    type: Map,
    of: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  lastNotificationAt: {
    type: Date
  },
  // DND Mode: Track notifications for this subscriber
  notificationHistory: [{
    notificationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Notification'
    },
    sentAt: Date,
    clicked: {
      type: Boolean,
      default: false
    },
    clickedAt: Date
  }]
});

// Indexes for faster segmentation queries
subscriberSchema.index({ project: 1, country: 1 });
subscriberSchema.index({ project: 1, state: 1 });
subscriberSchema.index({ project: 1, browser: 1 });
subscriberSchema.index({ project: 1, os: 1 });
subscriberSchema.index({ project: 1, device: 1 });
subscriberSchema.index({ project: 1, subscribedAt: 1 });

module.exports = mongoose.model('Subscriber', subscriberSchema);

