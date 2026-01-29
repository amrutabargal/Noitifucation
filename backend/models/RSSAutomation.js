const mongoose = require('mongoose');

const rssAutomationSchema = new mongoose.Schema({
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
  rssFeedUrl: {
    type: String,
    required: true
  },
  // Notification template for RSS items
  notificationTemplate: {
    title: String, // Can use {{title}}, {{description}}, etc.
    message: String,
    image: String, // Can use {{image}} or {{enclosure}}
    url: String, // Can use {{link}}
    icon: String,
    badge: String,
    logo: String
  },
  // Filter conditions
  filters: {
    keywords: [String], // Only send if title/description contains keywords
    excludeKeywords: [String], // Exclude if contains these
    categories: [String], // RSS categories/tags
    minLength: Number, // Minimum title/description length
    maxLength: Number // Maximum title/description length
  },
  // Target segment
  segment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Segment'
  },
  // Check frequency
  checkFrequency: {
    type: String,
    enum: ['5min', '15min', '30min', '1hour', '2hours', '6hours', '12hours', 'daily'],
    default: '1hour'
  },
  // Last processed items (to avoid duplicates)
  lastProcessedItems: [{
    url: String,
    guid: String,
    processedAt: Date
  }],
  // Last check time
  lastChecked: {
    type: Date
  },
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  // Statistics
  stats: {
    totalProcessed: {
      type: Number,
      default: 0
    },
    totalSent: {
      type: Number,
      default: 0
    },
    lastError: String
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
rssAutomationSchema.index({ project: 1, isActive: 1 });
rssAutomationSchema.index({ lastChecked: 1 });

module.exports = mongoose.model('RSSAutomation', rssAutomationSchema);

