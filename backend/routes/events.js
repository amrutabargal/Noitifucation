const express = require('express');
const Event = require('../models/Event');
const Project = require('../models/Project');
const Subscriber = require('../models/Subscriber');
const Automation = require('../models/Automation');
const Notification = require('../models/Notification');
const router = express.Router();

// Verify API key middleware
const verifyApiKey = async (req, res, next) => {
  const apiKey = req.header('X-API-Key');
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }

  try {
    const project = await Project.findOne({ apiKey });
    if (!project) {
      return res.status(401).json({ error: 'Invalid API key' });
    }
    req.project = project;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Track event (public endpoint with API key)
router.post('/track', verifyApiKey, async (req, res) => {
  try {
    const { eventName, eventData, timestamp, url, subscriberId } = req.body;

    if (!eventName) {
      return res.status(400).json({ error: 'eventName is required' });
    }

    let subscriber = null;
    if (subscriberId) {
      subscriber = await Subscriber.findById(subscriberId);
    }

    const event = await Event.create({
      project: req.project._id,
      subscriber: subscriber?._id,
      eventName,
      eventData: eventData || {},
      url: url || req.headers.referer,
      timestamp: timestamp ? new Date(timestamp) : new Date()
    });

    // Check for automations triggered by this event
    const automations = await Automation.find({
      project: req.project._id,
      isActive: true,
      'trigger.type': 'event',
      'trigger.eventName': eventName
    });

    for (const automation of automations) {
      // Check conditions
      let shouldTrigger = true;
      if (automation.trigger.conditions) {
        // Add condition logic here
      }

      if (shouldTrigger) {
        automation.lastTriggered = new Date();
        automation.triggerCount += 1;
        await automation.save();

        // Trigger notification if delay is 0, otherwise schedule
        if (automation.action.notification) {
          const notification = await Notification.findById(automation.action.notification);
          if (notification) {
            // Schedule or send notification based on delay
            // Implementation depends on your notification sending logic
          }
        }
      }
    }

    res.json({ success: true, eventId: event._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get events for a project (requires auth)
router.get('/project/:projectId', require('../middleware/auth'), async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      owner: req.user._id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const { eventName, startDate, endDate, limit = 100 } = req.query;
    
    let query = { project: req.params.projectId };
    
    if (eventName) {
      query.eventName = eventName;
    }
    
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const events = await Event.find(query)
      .populate('subscriber')
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

