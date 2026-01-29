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
  badge: {
    type: String // Badge image URL
  },
  logo: {
    type: String // Logo image URL
  },
  buttons: [{
    action: {
      type: String, // Action URL
      required: true
    },
    title: {
      type: String,
      required: true
    },
    icon: String // Optional icon URL for button
  }],
  url: {
    type: String
  },
  utm: {
    type: Map,
    of: String // UTM parameters: { utm_source, utm_medium, utm_campaign, etc. }
  },
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign'
  },
  dndMode: {
    enabled: {
      type: Boolean,
      default: false
    },
    maxNotifications: {
      type: Number,
      default: 5 // Maximum notifications to keep per user
    }
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
  },
  renewedAt: {
    type: Date // When notification was renewed
  },
  originalNotificationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notification' // Reference to original if this is a renewal
  },
  sourceUrl: {
    type: String // URL from which push data was loaded
  }
});

module.exports = mongoose.model('Notification', notificationSchema);

