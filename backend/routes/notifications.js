const express = require('express');
const Notification = require('../models/Notification');
const Project = require('../models/Project');
const { sendNotification } = require('../utils/notificationSender');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all notifications for a project
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      owner: req.user._id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const notifications = await Notification.find({ project: req.params.projectId })
      .sort({ createdAt: -1 });
    
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single notification
router.get('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)
      .populate('project');
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    const project = await Project.findOne({
      _id: notification.project._id,
      owner: req.user._id
    });

    if (!project) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create notification
router.post('/', auth, async (req, res) => {
  try {
    const { projectId, title, message, icon, image, url, type, scheduledFor, targetAudience, recurring, trigger } = req.body;

    const project = await Project.findOne({
      _id: projectId,
      owner: req.user._id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Calculate next send date for recurring notifications
    let nextSendDate = null;
    if (recurring && recurring.enabled && scheduledFor) {
      nextSendDate = calculateNextSendDate(new Date(scheduledFor), recurring.frequency, recurring.interval);
    }

    const notification = await Notification.create({
      project: projectId,
      title,
      message,
      icon,
      image,
      url,
      type: type || 'instant',
      scheduledFor,
      recurring: recurring || { enabled: false },
      trigger: trigger || null,
      targetAudience: targetAudience || {},
      status: type === 'scheduled' || (recurring && recurring.enabled) ? 'scheduled' : 'draft'
    });

    if (notification.recurring.enabled) {
      notification.recurring.nextSendDate = nextSendDate;
      await notification.save();
    }

    project.notifications.push(notification._id);
    await project.save();

    // If instant, send immediately
    if (type === 'instant' || (!type && !recurring?.enabled)) {
      await sendNotification(notification, project);
    }

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to calculate next send date for recurring notifications
function calculateNextSendDate(startDate, frequency, interval = 1) {
  const date = new Date(startDate);
  
  switch (frequency) {
    case 'daily':
      date.setDate(date.getDate() + interval);
      break;
    case 'weekly':
      date.setDate(date.getDate() + (7 * interval));
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + interval);
      break;
    default:
      return null;
  }
  
  return date;
}

// Send notification
router.post('/:id/send', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)
      .populate('project');
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    const project = await Project.findOne({
      _id: notification.project._id,
      owner: req.user._id
    });

    if (!project) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await sendNotification(notification, project);
    
    res.json({ message: 'Notification sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update notification
router.put('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)
      .populate('project');
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    const project = await Project.findOne({
      _id: notification.project._id,
      owner: req.user._id
    });

    if (!project) {
      return res.status(403).json({ error: 'Access denied' });
    }

    Object.assign(notification, req.body);
    await notification.save();

    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete notification
router.delete('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)
      .populate('project');
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    const project = await Project.findOne({
      _id: notification.project._id,
      owner: req.user._id
    });

    if (!project) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

