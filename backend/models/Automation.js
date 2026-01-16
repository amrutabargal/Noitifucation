const mongoose = require('mongoose');

const automationSchema = new mongoose.Schema({
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
  trigger: {
    type: {
      type: String,
      enum: ['event', 'time', 'subscriber_count', 'api'],
      required: true
    },
    eventName: String,
    conditions: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    }
  },
  action: {
    notification: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Notification'
    },
    delay: {
      type: Number, // in minutes
      default: 0
    }
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
  isActive: {
    type: Boolean,
    default: true
  },
  lastTriggered: {
    type: Date
  },
  triggerCount: {
    type: Number,
    default: 0
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

module.exports = mongoose.model('Automation', automationSchema);

