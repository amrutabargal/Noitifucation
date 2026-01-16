const webpush = require('web-push');
const Subscriber = require('../models/Subscriber');

/**
 * Send notification to subscribers
 * This is extracted to be used by both routes and cron jobs
 */
async function sendNotification(notification, project) {
  try {
    // Configure web-push
    webpush.setVAPIDDetails(
      project.vapidSubject,
      project.vapidPublicKey,
      project.vapidPrivateKey
    );
  } catch (error) {
    console.error('Error setting VAPID details:', error);
    throw error;
  }

  // Get subscribers based on targeting
  let query = { project: project._id, isActive: true };

  if (notification.targetAudience?.browsers?.length > 0) {
    query.browser = { $in: notification.targetAudience.browsers };
  }

  if (notification.targetAudience?.countries?.length > 0) {
    query.country = { $in: notification.targetAudience.countries };
  }

  if (notification.targetAudience?.tags?.length > 0) {
    query.tags = { $in: notification.targetAudience.tags };
  }

  const subscribers = await Subscriber.find(query);
  
  const payload = JSON.stringify({
    title: notification.title,
    message: notification.message,
    icon: notification.icon || '/icon-192x192.png',
    image: notification.image,
    url: notification.url || '/',
    badge: notification.icon || '/icon-192x192.png'
  });

  let sent = 0;
  let delivered = 0;
  let failed = 0;

  const promises = subscribers.map(async (subscriber) => {
    try {
      if (!subscriber.endpoint || !subscriber.keys || !subscriber.keys.p256dh || !subscriber.keys.auth) {
        console.warn('Invalid subscriber data:', subscriber._id);
        sent++;
        failed++;
        return;
      }
      
      await webpush.sendNotification(
        {
          endpoint: subscriber.endpoint,
          keys: {
            p256dh: subscriber.keys.p256dh,
            auth: subscriber.keys.auth
          }
        },
        payload
      );
      sent++;
      delivered++;
      subscriber.lastNotificationAt = new Date();
      await subscriber.save();
    } catch (error) {
      sent++;
      failed++;
      console.error('Error sending notification to subscriber:', subscriber._id, error.message);
      if (error.statusCode === 410 || error.statusCode === 404) {
        subscriber.isActive = false;
        await subscriber.save();
      }
    }
  });

  await Promise.allSettled(promises);

  notification.status = 'sent';
  notification.sent = sent;
  notification.delivered = delivered;
  notification.failed = failed;
  notification.sentAt = new Date();
  await notification.save();

  return { sent, delivered, failed };
}

module.exports = { sendNotification };

