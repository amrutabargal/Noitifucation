const Notification = require('../models/Notification');
const Project = require('../models/Project');
const { sendNotification } = require('../utils/notificationSender');

/**
 * Check and send recurring notifications
 * This should be run as a cron job (every hour or every few minutes)
 */
async function processRecurringNotifications() {
  try {
    const now = new Date();
    
    // Find all active recurring notifications that are due
    const dueNotifications = await Notification.find({
      type: 'recurring',
      'recurring.enabled': true,
      status: { $in: ['scheduled', 'sent'] },
      $or: [
        { 'recurring.nextSendDate': { $lte: now } },
        { scheduledFor: { $lte: now } }
      ],
      $or: [
        { 'recurring.endDate': { $exists: false } },
        { 'recurring.endDate': { $gte: now } }
      ]
    }).populate('project');

    for (const notification of dueNotifications) {
      try {
        const project = notification.project;
        
        // Send notification
        await sendNotification(notification, project);
        
        // Calculate next send date
        if (notification.recurring.enabled) {
          const nextDate = calculateNextSendDate(
            notification.recurring.nextSendDate || notification.scheduledFor,
            notification.recurring.frequency,
            notification.recurring.interval
          );
          
          notification.recurring.nextSendDate = nextDate;
          notification.status = 'scheduled';
          await notification.save();
        }
      } catch (error) {
        console.error(`Error processing recurring notification ${notification._id}:`, error);
        notification.status = 'failed';
        await notification.save();
      }
    }

    return { processed: dueNotifications.length };
  } catch (error) {
    console.error('Error processing recurring notifications:', error);
    throw error;
  }
}

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

// Export for use in cron jobs or manual execution
module.exports = { processRecurringNotifications };

// If running directly (for testing)
if (require.main === module) {
  processRecurringNotifications()
    .then(result => {
      console.log('Recurring notifications processed:', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('Error:', error);
      process.exit(1);
    });
}

