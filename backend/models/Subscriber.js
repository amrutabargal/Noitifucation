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
  }
});

module.exports = mongoose.model('Subscriber', subscriberSchema);

