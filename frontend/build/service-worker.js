/* eslint-disable no-restricted-globals */
// Service Worker for Push Notifications

const CACHE_NAME = 'pushnotify-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});

// Push event
self.addEventListener('push', (event) => {
  let data = {};
  
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'New Notification', message: event.data.text() };
    }
  }

  const options = {
    body: data.message || 'You have a new notification',
    icon: data.icon || '/icon-192x192.png',
    image: data.image,
    badge: data.badge || '/icon-192x192.png',
    vibrate: [200, 100, 200],
    tag: 'notification',
    requireInteraction: false,
    actions: data.url ? [
      {
        action: 'open',
        title: 'Open'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ] : []
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Notification', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    const urlToOpen = event.notification.data?.url || '/';
    
    event.waitUntil(
      clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      }).then((clientList) => {
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  }
});

// Background sync (optional)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-subscription') {
    event.waitUntil(syncSubscription());
  }
});

async function syncSubscription() {
  // Handle subscription sync
  console.log('Syncing subscription...');
}

