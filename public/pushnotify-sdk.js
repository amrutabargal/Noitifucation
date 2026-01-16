/**
 * PushNotify JavaScript SDK
 * Easy integration for web push notifications
 */
(function(window) {
  'use strict';

  const PushNotify = {
    config: null,
    subscription: null,
    serviceWorkerRegistration: null,

    /**
     * Initialize PushNotify SDK
     * @param {Object} config - Configuration object
     * @param {string} config.projectId - Project ID
     * @param {string} config.vapidPublicKey - VAPID public key
     * @param {string} config.apiKey - API key
     * @param {string} config.apiUrl - API URL
     * @param {Object} config.options - Additional options
     */
    init: function(config) {
      if (!config || !config.projectId || !config.vapidPublicKey || !config.apiKey) {
        console.error('PushNotify: Missing required configuration');
        return Promise.reject('Missing required configuration');
      }

      this.config = {
        projectId: config.projectId,
        vapidPublicKey: config.vapidPublicKey,
        apiKey: config.apiKey,
        apiUrl: config.apiUrl || 'http://localhost:5000/api',
        options: config.options || {}
      };

      return this.registerServiceWorker()
        .then(() => this.checkSubscription())
        .catch(err => {
          console.error('PushNotify: Initialization error', err);
          return Promise.reject(err);
        });
    },

    /**
     * Register service worker
     */
    registerServiceWorker: function() {
      if (!('serviceWorker' in navigator)) {
        return Promise.reject('Service workers are not supported');
      }

      return navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          this.serviceWorkerRegistration = registration;
          console.log('PushNotify: Service Worker registered');
          return registration;
        })
        .catch(err => {
          console.error('PushNotify: Service Worker registration failed', err);
          return Promise.reject(err);
        });
    },

    /**
     * Check existing subscription
     */
    checkSubscription: function() {
      if (!this.serviceWorkerRegistration) {
        return Promise.reject('Service Worker not registered');
      }

      return this.serviceWorkerRegistration.pushManager.getSubscription()
        .then(subscription => {
          this.subscription = subscription;
          if (subscription) {
            this.updateSubscriptionOnServer(subscription);
          }
          return subscription;
        });
    },

    /**
     * Request notification permission and subscribe
     */
    subscribe: function() {
      if (!('Notification' in window)) {
        return Promise.reject('Notifications are not supported in this browser');
      }

      return Notification.requestPermission()
        .then(permission => {
          if (permission !== 'granted') {
            return Promise.reject('Notification permission denied');
          }

          return this.serviceWorkerRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: this.urlBase64ToUint8Array(this.config.vapidPublicKey)
          });
        })
        .then(subscription => {
          this.subscription = subscription;
          return this.updateSubscriptionOnServer(subscription);
        });
    },

    /**
     * Unsubscribe from push notifications
     */
    unsubscribe: function() {
      if (!this.subscription) {
        return Promise.resolve();
      }

      return this.subscription.unsubscribe()
        .then(() => {
          this.updateSubscriptionOnServer(null, true);
          this.subscription = null;
          return true;
        });
    },

    /**
     * Update subscription on server
     */
    updateSubscriptionOnServer: function(subscription, isUnsubscribe = false) {
      if (isUnsubscribe && subscription) {
        return fetch(`${this.config.apiUrl}/subscribers/unsubscribe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': this.config.apiKey
          },
          body: JSON.stringify({
            endpoint: subscription.endpoint
          })
        });
      }

      if (!subscription) return Promise.resolve();

      const subscriptionData = {
        projectId: this.config.projectId,
        subscription: {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: this.arrayBufferToBase64(subscription.getKey('p256dh')),
            auth: this.arrayBufferToBase64(subscription.getKey('auth'))
          }
        },
        userAgent: navigator.userAgent,
        browser: this.getBrowser(),
        os: this.getOS(),
        tags: this.config.options.tags || [],
        attributes: this.config.options.attributes || {}
      };

      return fetch(`${this.config.apiUrl}/subscribers/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.config.apiKey
        },
        body: JSON.stringify(subscriptionData)
      })
      .then(response => response.json())
      .then(data => {
        console.log('PushNotify: Subscription updated', data);
        return data;
      })
      .catch(err => {
        console.error('PushNotify: Subscription update failed', err);
        return Promise.reject(err);
      });
    },

    /**
     * Track event
     */
    trackEvent: function(eventName, eventData = {}) {
      if (!this.config) {
        console.warn('PushNotify: SDK not initialized');
        return Promise.resolve();
      }

      return fetch(`${this.config.apiUrl}/events/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.config.apiKey
        },
        body: JSON.stringify({
          projectId: this.config.projectId,
          eventName,
          eventData,
          timestamp: new Date().toISOString(),
          url: window.location.href
        })
      }).catch(err => console.error('PushNotify: Event tracking failed', err));
    },

    /**
     * Set user attributes
     */
    setUserAttributes: function(attributes) {
      if (this.subscription) {
        return this.updateSubscriptionOnServer(this.subscription);
      }
      return Promise.resolve();
    },

    /**
     * Set user tags
     */
    setUserTags: function(tags) {
      if (this.config.options) {
        this.config.options.tags = tags;
      }
      if (this.subscription) {
        return this.updateSubscriptionOnServer(this.subscription);
      }
      return Promise.resolve();
    },

    /**
     * Check if subscribed
     */
    isSubscribed: function() {
      return !!this.subscription;
    },

    /**
     * Get subscription status
     */
    getSubscriptionStatus: function() {
      if (!('Notification' in window)) {
        return 'not_supported';
      }
      if (Notification.permission === 'denied') {
        return 'denied';
      }
      if (Notification.permission === 'granted' && this.subscription) {
        return 'subscribed';
      }
      return 'not_subscribed';
    },

    // Utility functions
    urlBase64ToUint8Array: function(base64String) {
      const padding = '='.repeat((4 - base64String.length % 4) % 4);
      const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    },

    arrayBufferToBase64: function(buffer) {
      const bytes = new Uint8Array(buffer);
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return window.btoa(binary);
    },

    getBrowser: function() {
      const ua = navigator.userAgent;
      if (ua.indexOf('Chrome') > -1) return 'Chrome';
      if (ua.indexOf('Firefox') > -1) return 'Firefox';
      if (ua.indexOf('Safari') > -1) return 'Safari';
      if (ua.indexOf('Edge') > -1) return 'Edge';
      return 'Unknown';
    },

    getOS: function() {
      const ua = navigator.userAgent;
      if (ua.indexOf('Windows') > -1) return 'Windows';
      if (ua.indexOf('Mac') > -1) return 'macOS';
      if (ua.indexOf('Linux') > -1) return 'Linux';
      if (ua.indexOf('Android') > -1) return 'Android';
      if (ua.indexOf('iOS') > -1) return 'iOS';
      return 'Unknown';
    }
  };

  // Auto-initialize if config provided via data attributes
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      const script = document.querySelector('script[data-pushnotify]');
      if (script) {
        const config = {
          projectId: script.getAttribute('data-project-id'),
          vapidPublicKey: script.getAttribute('data-vapid-key'),
          apiKey: script.getAttribute('data-api-key'),
          apiUrl: script.getAttribute('data-api-url')
        };
        if (config.projectId && config.vapidPublicKey && config.apiKey) {
          PushNotify.init(config);
        }
      }
    });
  }

  // Export to window
  window.PushNotify = PushNotify;

})(window);

