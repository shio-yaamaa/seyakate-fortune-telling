// Lifecycle event listeners

self.addEventListener('install', () => console.log('Installed'));
self.addEventListener('activate', () => console.log('Activated'));

// Notification-related event listeners

self.addEventListener('push', event => {
  console.log('Push notification received!');
  if (event.data) {
    NotificationManager.showNotification(self.registration);
  }
});

self.addEventListener('notificationclick', event => {
  NotificationManager.handleClick(event, clients);
});

// Utility classes

class NotificationManager {
  get bodyText() {
    return 'Hi';
  }
  
  // Create a set of options to pass in to showNotification()
  get options() {
    return {
      tag: NOTIFICATION_TAG,
      body: this.bodyText,
      // icon
      // image
    };
  }
  
  showNotification(registration) {
    registration.showNotification(NOTIFICATION_TITLE, this.options);
  }
  
  handleClick(event, clients) {
    clients.openWindow('https://www.google.com/');
    event.notification.close();
  }
}