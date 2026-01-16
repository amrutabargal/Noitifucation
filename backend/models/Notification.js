const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
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
  icon: {
    type: String
  },
  image: {
    type: String
  },
  url: {
    type: String
  },
  type: {
    type: String,
    enum: ['instant', 'scheduled', 'triggered', 'recurring'],
    default: 'instant'
  },
  scheduledFor: {
    type: Date
  },
  recurring: {
    enabled: {
      type: Boolean,
      default: false
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly']
    },
    interval: {
      type: Number,
      default: 1 // every 1 day/week/month
    },
    endDate: Date,
    nextSendDate: Date
  },
  trigger: {
    eventName: String,
    conditions: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    }
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'sending', 'sent', 'failed'],
    default: 'draft'
  },
  targetAudience: {
    browsers: [String],
    countries: [String],
    tags: [String],
    attributes: {
      type: Map,
      of: String
    }
  },
  sent: {
    type: Number,
    default: 0
  },
  delivered: {
    type: Number,
    default: 0
  },
  clicked: {
    type: Number,
    default: 0
  },
  failed: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  sentAt: {
    type: Date
  }
});

module.exports = mongoose.model('Notification', notificationSchema);

