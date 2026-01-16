const express = require('express');
const Subscriber = require('../models/Subscriber');
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const { stringify } = require('../utils/csvHelper');
const router = express.Router();

// Get all subscribers for a project
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      owner: req.user._id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const subscribers = await Subscriber.find({ project: req.params.projectId })
      .sort({ subscribedAt: -1 });
    
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Subscribe endpoint (public, no auth required)
router.post('/subscribe', async (req, res) => {
  try {
    const { projectId, subscription, userAgent, browser, os, country, timezone, tags, attributes } = req.body;

    if (!projectId || !subscription || !subscription.endpoint || !subscription.keys) {
      return res.status(400).json({ error: 'Missing required fields: projectId, subscription, endpoint, keys' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    let subscriber = await Subscriber.findOne({ endpoint: subscription.endpoint });

    if (subscriber) {
      subscriber.project = projectId;
      subscriber.keys = subscription.keys;
      subscriber.userAgent = userAgent;
      subscriber.browser = browser;
      subscriber.os = os;
      subscriber.country = country;
      subscriber.timezone = timezone;
      subscriber.tags = tags || [];
      subscriber.attributes = attributes || {};
      subscriber.isActive = true;
      await subscriber.save();
    } else {
      subscriber = await Subscriber.create({
        project: projectId,
        endpoint: subscription.endpoint,
        keys: subscription.keys,
        userAgent,
        browser,
        os,
        country,
        timezone,
        tags: tags || [],
        attributes: attributes || {}
      });

      project.subscribers.push(subscriber._id);
      await project.save();
    }

    res.status(201).json({ 
      message: 'Subscribed successfully',
      subscriber: subscriber._id 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Unsubscribe
router.post('/unsubscribe', async (req, res) => {
  try {
    const { endpoint } = req.body;
    
    const subscriber = await Subscriber.findOne({ endpoint });
    if (subscriber) {
      subscriber.isActive = false;
      await subscriber.save();
    }

    res.json({ message: 'Unsubscribed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get subscriber stats
router.get('/stats/:projectId', auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      owner: req.user._id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const total = await Subscriber.countDocuments({ project: req.params.projectId });
    const active = await Subscriber.countDocuments({ 
      project: req.params.projectId, 
      isActive: true 
    });

    const browserStats = await Subscriber.aggregate([
      { $match: { project: project._id } },
      { $group: { _id: '$browser', count: { $sum: 1 } } }
    ]);

    const countryStats = await Subscriber.aggregate([
      { $match: { project: project._id } },
      { $group: { _id: '$country', count: { $sum: 1 } } }
    ]);

    res.json({
      total,
      active,
      inactive: total - active,
      browserStats,
      countryStats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export subscribers as CSV
router.get('/export/:projectId', auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      owner: req.user._id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const subscribers = await Subscriber.find({ project: req.params.projectId })
      .sort({ subscribedAt: -1 });

    const csvData = subscribers.map(sub => ({
      'Endpoint': sub.endpoint,
      'Browser': sub.browser || 'Unknown',
      'OS': sub.os || 'Unknown',
      'Country': sub.country || 'Unknown',
      'Timezone': sub.timezone || 'Unknown',
      'Tags': sub.tags?.join(',') || '',
      'Status': sub.isActive ? 'Active' : 'Inactive',
      'Subscribed At': new Date(sub.subscribedAt).toISOString(),
      'Last Notification': sub.lastNotificationAt ? new Date(sub.lastNotificationAt).toISOString() : ''
    }));

    const csvString = stringify(csvData, { header: true });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="subscribers-${project.name}-${Date.now()}.csv"`);
    res.send(csvString);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Import subscribers (CSV format)
router.post('/import/:projectId', auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      owner: req.user._id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // This is a simplified version - in production, use a proper CSV parser
    const { subscribers } = req.body; // Array of subscriber objects
    
    if (!Array.isArray(subscribers)) {
      return res.status(400).json({ error: 'Subscribers must be an array' });
    }

    const imported = [];
    const errors = [];

    for (const subData of subscribers) {
      try {
        if (!subData.endpoint || !subData.keys) {
          errors.push({ data: subData, error: 'Missing endpoint or keys' });
          continue;
        }

        let subscriber = await Subscriber.findOne({ endpoint: subData.endpoint });
        
        if (subscriber) {
          // Update existing
          Object.assign(subscriber, {
            browser: subData.browser,
            os: subData.os,
            country: subData.country,
            timezone: subData.timezone,
            tags: subData.tags || [],
            isActive: subData.isActive !== false
          });
          await subscriber.save();
        } else {
          // Create new
          subscriber = await Subscriber.create({
            project: project._id,
            endpoint: subData.endpoint,
            keys: subData.keys,
            browser: subData.browser,
            os: subData.os,
            country: subData.country,
            timezone: subData.timezone,
            tags: subData.tags || [],
            isActive: subData.isActive !== false
          });
          
          project.subscribers.push(subscriber._id);
        }
        
        imported.push(subscriber._id);
      } catch (error) {
        errors.push({ data: subData, error: error.message });
      }
    }

    await project.save();

    res.json({
      imported: imported.length,
      errors: errors.length,
      details: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

