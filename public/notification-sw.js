// Lifecycle event listeners

self.addEventListener('install', () => console.log('Installed'));
self.addEventListener('activate', () => console.log('Activated'));

// Notification-related event listeners

self.addEventListener('push', () => {
  console.log('Push notification received!');
  const resultString = await fetchResult();
  notificationManager.showNotification(self.registration, result);
});

self.addEventListener('notificationclick', event => {
  notificationManager.handleClick(event, clients);
});

// IndexedDB

class LocalDatabase {
  dbName = 'LocalDatabase';
  tableName = 'results';

  getName() {

  };
}

const localDatabase = new LocalDatabase();

// Result

const FETCH_RESULT_ENDPOINT = 'https://0u3uohct72.execute-api.ap-northeast-1.amazonaws.com/default/seyakate-fortune-telling-fetch-result';

const fetchResult = name => {
  const xhr;
};

// Notification

const NOTIFICATION_TAG = 'seyakate-fortune-telling';
const NOTIFICATION_TITLE = '今日の服部';
const NOTIFICATION_URL = 'https://seyakate.netlify.com/';

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