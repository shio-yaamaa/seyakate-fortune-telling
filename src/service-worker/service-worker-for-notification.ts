import NotificationManager from './NotificationManager';

// Type declarations for ServiceWorker-related variables
// Can be removed once they are officially supported
declare var self: ServiceWorkerGlobalScope;
declare var clients: Clients;

// Lifecycle event listeners

self.addEventListener('install', () => console.log('Installed'));

self.addEventListener('activate', () => console.log('Activated'));

// Notification-related event listeners

self.addEventListener('push', (event: PushEvent) => {
  console.log('Push notification received!');
  if (event.data) {
    NotificationManager.showNotification(self.registration);
  }
});

self.addEventListener('notificationclick', (event: NotificationEvent) => {
  NotificationManager.handleClick(event, clients);
});