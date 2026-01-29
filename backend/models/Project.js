const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    enum: ['website', 'wordpress', 'shopify', 'other'],
    default: 'website'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vapidPublicKey: {
    type: String,
    required: true
  },
  vapidPrivateKey: {
    type: String,
    required: true
  },
  vapidSubject: {
    type: String,
    required: true
  },
  apiKey: {
    type: String,
    unique: true,
    required: true
  },
  apiKeys: [{
    key: {
      type: String,
      required: true
    },
    name: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    lastUsed: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  subscribers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscriber'
  }],
  notifications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notification'
  }],
  campaigns: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign'
  }],
  segments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Segment'
  }],
  promptSettings: {
    design: {
      type: String,
      enum: ['native', 'custom1', 'custom2', 'custom3', 'custom4', 'custom5'],
      default: 'native'
    },
    properties: {
      buttonBgColor: String,
      buttonText: String,
      buttonTextColor: String,
      mainText: String,
      mainTextColor: String,
      subText: String,
      subTextColor: String,
      bodyBgOpacity: Number, // 0-1
      cancelButtonVisible: {
        type: Boolean,
        default: true
      },
      delay: {
        type: Number,
        default: 0 // seconds
      },
      position: {
        type: String,
        enum: ['top', 'bottom', 'center'],
        default: 'bottom'
      },
      borderRadius: Number,
      fontSize: Number,
      fontFamily: String
    }
  },
  dndSettings: {
    enabled: {
      type: Boolean,
      default: false
    },
    maxNotifications: {
      type: Number,
      default: 5
    }
  },
  integrationScript: {
    type: String // Generated integration script
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

module.exports = mongoose.model('Project', projectSchema);

