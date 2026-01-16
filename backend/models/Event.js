const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  subscriber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscriber',
    required: false
  },
  eventName: {
    type: String,
    required: true,
    index: true
  },
  eventData: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  url: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

module.exports = mongoose.model('Event', eventSchema);

