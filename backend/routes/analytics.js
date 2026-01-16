const express = require('express');
const Notification = require('../models/Notification');
const Project = require('../models/Project');
const Subscriber = require('../models/Subscriber');
const auth = require('../middleware/auth');
const { stringify } = require('../utils/csvHelper');
const router = express.Router();

// Get analytics for a project
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      owner: req.user._id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const notifications = await Notification.find({ project: req.params.projectId });
    
    const totalSent = notifications.reduce((sum, n) => sum + (n.sent || 0), 0);
    const totalDelivered = notifications.reduce((sum, n) => sum + (n.delivered || 0), 0);
    const totalClicked = notifications.reduce((sum, n) => sum + (n.clicked || 0), 0);
    const totalFailed = notifications.reduce((sum, n) => sum + (n.failed || 0), 0);
    
    const deliveryRate = totalSent > 0 ? parseFloat((totalDelivered / totalSent * 100).toFixed(2)) : 0;
    const clickRate = totalDelivered > 0 ? parseFloat((totalClicked / totalDelivered * 100).toFixed(2)) : 0;

    // Subscriber growth over time
    const subscriberGrowth = await Subscriber.aggregate([
      { $match: { project: project._id } },
      {
        $group: {
          _id: {
            year: { $year: '$subscribedAt' },
            month: { $month: '$subscribedAt' },
            day: { $dayOfMonth: '$subscribedAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]).catch(() => []);

    // Notification performance over time
    const notificationPerformance = await Notification.aggregate([
      { $match: { project: project._id, sentAt: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: {
            year: { $year: '$sentAt' },
            month: { $month: '$sentAt' },
            day: { $dayOfMonth: '$sentAt' }
          },
          sent: { $sum: '$sent' },
          delivered: { $sum: '$delivered' },
          clicked: { $sum: '$clicked' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]).catch(() => []);

    res.json({
      overview: {
        totalSent,
        totalDelivered,
        totalClicked,
        totalFailed,
        deliveryRate,
        clickRate
      },
      subscriberGrowth,
      notificationPerformance,
      recentNotifications: notifications.slice(0, 10)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export analytics report as CSV
router.get('/export/:projectId', auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      owner: req.user._id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const { startDate, endDate } = req.query;
    let query = { project: req.params.projectId };
    
    if (startDate || endDate) {
      query.sentAt = {};
      if (startDate) query.sentAt.$gte = new Date(startDate);
      if (endDate) query.sentAt.$lte = new Date(endDate);
    }

    const notifications = await Notification.find(query).sort({ sentAt: -1 });

    const csvData = notifications.map(notif => ({
      'Title': notif.title,
      'Message': notif.message,
      'Type': notif.type,
      'Status': notif.status,
      'Sent': notif.sent || 0,
      'Delivered': notif.delivered || 0,
      'Clicked': notif.clicked || 0,
      'Failed': notif.failed || 0,
      'Delivery Rate': notif.sent > 0 ? ((notif.delivered / notif.sent) * 100).toFixed(2) + '%' : '0%',
      'Click Rate': notif.delivered > 0 ? ((notif.clicked / notif.delivered) * 100).toFixed(2) + '%' : '0%',
      'Sent At': notif.sentAt ? new Date(notif.sentAt).toISOString() : '',
      'Created At': new Date(notif.createdAt).toISOString()
    }));

    const csvString = stringify(csvData, { header: true });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="analytics-${project.name}-${Date.now()}.csv"`);
    res.send(csvString);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

