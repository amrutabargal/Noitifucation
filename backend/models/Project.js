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
  subscribers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscriber'
  }],
  notifications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notification'
  }],
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

