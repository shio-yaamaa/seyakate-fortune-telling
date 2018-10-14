// Lifecycle event listeners

self.addEventListener('install', () => console.log('Installed'));
self.addEventListener('activate', () => console.log('Activated'));

// Notification-related event listeners

self.addEventListener('push', event => {
  console.log('Push notification received!');
  if (event.data) {
    notificationManager.showNotification(self.registration);
  }
});

self.addEventListener('notificationclick', event => {
  notificationManager.handleClick(event, clients);
});

// Notification Utility

const NOTIFICATION_TAG = 'seyakate-fortune-telling';
const NOTIFICATION_TITLE = '今日の服部';
const NOTIFICATION_URL = 'https://www.google.com/';

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
    clients.openWindow(NOTIFICATION_URL);
    event.notification.close();
  }
}

const notificationManager = new NotificationManager();