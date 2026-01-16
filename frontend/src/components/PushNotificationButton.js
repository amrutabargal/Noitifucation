import React, { useState, useEffect } from 'react';
import { subscribeToPush, requestNotificationPermission } from '../utils/pushNotification';
import toast from 'react-hot-toast';

const PushNotificationButton = ({ projectId, vapidPublicKey, apiUrl }) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    try {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const handleSubscribe = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      toast.error('Push notifications are not supported in this browser');
      return;
    }

    setIsLoading(true);
    try {
      const hasPermission = await requestNotificationPermission();
      if (!hasPermission) {
        toast.error('Notification permission denied');
        setIsLoading(false);
        return;
      }

      await subscribeToPush(vapidPublicKey, projectId, apiUrl);
      setIsSubscribed(true);
      toast.success('Successfully subscribed to push notifications!');
    } catch (error) {
      toast.error('Failed to subscribe: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-green-700 font-medium">✓ Subscribed to push notifications</p>
      </div>
    );
  }

  return (
    <button
      onClick={handleSubscribe}
      disabled={isLoading}
      className="btn-primary w-full"
    >
      {isLoading ? 'Subscribing...' : 'Enable Push Notifications'}
    </button>
  );
};

export default PushNotificationButton;
