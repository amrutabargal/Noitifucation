# PushNotify Integration Guide

## JavaScript SDK Integration

### 1. Quick Start

Add the PushNotify SDK to your website:

```html
<!-- Add this before closing </head> tag -->
<script src="https://your-domain.com/pushnotify-sdk.js"></script>

<script>
  // Initialize PushNotify
  PushNotify.init({
    projectId: 'YOUR_PROJECT_ID',
    vapidPublicKey: 'YOUR_VAPID_PUBLIC_KEY',
    apiKey: 'YOUR_API_KEY',
    apiUrl: 'https://api.your-domain.com/api' // Optional, defaults to your API
  });
</script>
```

### 2. Subscription Flow

```javascript
// Request subscription
PushNotify.subscribe()
  .then(() => {
    console.log('Subscribed successfully!');
  })
  .catch(error => {
    console.error('Subscription failed:', error);
  });

// Check subscription status
if (PushNotify.isSubscribed()) {
  console.log('User is subscribed');
}

// Get subscription status
const status = PushNotify.getSubscriptionStatus();
// Returns: 'subscribed', 'not_subscribed', 'denied', or 'not_supported'
```

### 3. Event Tracking

Track user events for automation:

```javascript
// Track page visit
PushNotify.trackEvent('page_visit', {
  page: window.location.pathname,
  referrer: document.referrer
});

// Track button click
document.getElementById('button').addEventListener('click', () => {
  PushNotify.trackEvent('button_click', {
    button: 'checkout',
    page: 'product'
  });
});

// Track custom event
PushNotify.trackEvent('purchase', {
  product_id: '123',
  amount: 99.99,
  currency: 'USD'
});
```

### 4. User Attributes & Tags

```javascript
// Set user attributes
PushNotify.setUserAttributes({
  plan: 'premium',
  country: 'US',
  language: 'en'
});

// Set user tags
PushNotify.setUserTags(['vip', 'beta_user', 'newsletter']);
```

### 5. Complete Example

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Website</title>
  <script src="https://your-domain.com/pushnotify-sdk.js"></script>
</head>
<body>
  <button id="subscribeBtn">Enable Push Notifications</button>

  <script>
    // Initialize
    PushNotify.init({
      projectId: 'YOUR_PROJECT_ID',
      vapidPublicKey: 'YOUR_VAPID_PUBLIC_KEY',
      apiKey: 'YOUR_API_KEY',
      apiUrl: 'https://api.your-domain.com/api'
    }).then(() => {
      // Check if already subscribed
      if (PushNotify.isSubscribed()) {
        document.getElementById('subscribeBtn').textContent = 'Subscribed ✓';
        document.getElementById('subscribeBtn').disabled = true;
      }
    });

    // Subscribe button
    document.getElementById('subscribeBtn').addEventListener('click', () => {
      PushNotify.subscribe()
        .then(() => {
          alert('Notifications enabled!');
          document.getElementById('subscribeBtn').textContent = 'Subscribed ✓';
          document.getElementById('subscribeBtn').disabled = true;
        })
        .catch(error => {
          alert('Failed to enable notifications: ' + error);
        });
    });

    // Track page view
    PushNotify.trackEvent('page_view', {
      page: window.location.pathname
    });
  </script>
</body>
</html>
```

## REST API Integration

### Authentication

All API requests (except public endpoints) require authentication:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

For SDK requests, use API Key:

```http
X-API-Key: YOUR_API_KEY
```

### Send Notification via API

```javascript
// Send instant notification
fetch('https://api.your-domain.com/api/notifications', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    projectId: 'YOUR_PROJECT_ID',
    title: 'Hello!',
    message: 'This is a test notification',
    url: 'https://your-website.com',
    icon: 'https://your-website.com/icon.png',
    type: 'instant',
    targetAudience: {
      browsers: ['Chrome', 'Firefox'],
      countries: ['US', 'UK'],
      tags: ['vip']
    }
  })
});
```

### Trigger-based Notification

```javascript
// Track event that triggers notification
fetch('https://api.your-domain.com/api/events/track', {
  method: 'POST',
  headers: {
    'X-API-Key': 'YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    projectId: 'YOUR_PROJECT_ID',
    eventName: 'cart_abandoned',
    eventData: {
      cart_value: 150.00,
      items: 3
    }
  })
});
```

## WordPress Integration

### Manual Integration

1. Copy `pushnotify-sdk.js` to your theme directory
2. Add to `functions.php`:

```php
function pushnotify_enqueue_scripts() {
    wp_enqueue_script(
        'pushnotify-sdk',
        get_template_directory_uri() . '/pushnotify-sdk.js',
        array(),
        '1.0.0',
        true
    );
    
    wp_add_inline_script('pushnotify-sdk', '
        PushNotify.init({
            projectId: "' . get_option('pushnotify_project_id') . '",
            vapidPublicKey: "' . get_option('pushnotify_vapid_key') . '",
            apiKey: "' . get_option('pushnotify_api_key') . '"
        });
    ');
}
add_action('wp_enqueue_scripts', 'pushnotify_enqueue_scripts');
```

3. Add settings page in WordPress admin
4. Store project ID, VAPID key, and API key in WordPress options

## Automation Setup

### Create Automation via API

```javascript
fetch('https://api.your-domain.com/api/automations', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    projectId: 'YOUR_PROJECT_ID',
    name: 'Welcome Notification',
    description: 'Send welcome notification to new subscribers',
    trigger: {
      type: 'event',
      eventName: 'subscribed'
    },
    action: {
      notification: 'NOTIFICATION_ID',
      delay: 0 // minutes
    },
    targetAudience: {
      tags: ['new_user']
    }
  })
});
```

## Recurring Notifications

### Create Recurring Notification

```javascript
fetch('https://api.your-domain.com/api/notifications', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    projectId: 'YOUR_PROJECT_ID',
    title: 'Weekly Newsletter',
    message: 'Your weekly digest is here!',
    type: 'recurring',
    recurring: {
      enabled: true,
      frequency: 'weekly', // 'daily', 'weekly', 'monthly'
      interval: 1, // every 1 week
      endDate: '2024-12-31T23:59:59Z' // optional
    },
    scheduledFor: '2024-01-15T10:00:00Z'
  })
});
```

## Service Worker

The SDK automatically registers the service worker. Make sure `service-worker.js` is available at your website root.

## Troubleshooting

### Check Subscription Status

```javascript
console.log(PushNotify.getSubscriptionStatus());
```

### Manual Unsubscribe

```javascript
PushNotify.unsubscribe()
  .then(() => console.log('Unsubscribed'))
  .catch(error => console.error('Error:', error));
```

### Browser Support

- ✅ Chrome 42+
- ✅ Firefox 44+
- ✅ Edge 17+
- ✅ Safari 16+ (macOS & iOS)

### HTTPS Required

Push notifications require HTTPS. Use `http://localhost` for development.

## Support

For more help, check:
- API Documentation: `/api/docs`
- Dashboard: https://dashboard.your-domain.com
- Support: support@your-domain.com

