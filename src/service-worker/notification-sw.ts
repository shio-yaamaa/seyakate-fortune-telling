import { DEFAULT_NAME } from '../utility/constants';

import JSTDate from '../utility/JSTDate';
import LocalDatabase from '../utility/LocalDatabase';

import NotificationManager from './NotificationManager';
import fetchResult from './fetchResult'; // Different from '../utility/fetchResult' in that it uses fetch API, which is available in Service Worker

declare var self: ServiceWorkerGlobalScope;

self.addEventListener('push', async () => {
  try {
    // Whether today's result has been already fetched or not determines if the notification should be silent or not
    const resultInDB = await LocalDatabase.getResult(JSTDate.today());

    const name = await LocalDatabase.getName();
    if (name === null) throw Error('Could not fetch name from DB');
    const result = await fetchResult(name === '' ? DEFAULT_NAME : name);
    NotificationManager.showNotification(self.registration, result, resultInDB !== null);
    
    // Store today's result in the DB if it hasn't been saved yet
    if (resultInDB === null) {
      LocalDatabase.setTodaysResult(result);
    }
  } catch (error) {
    console.log(error);
  }
});

self.addEventListener('notificationclick', (event: NotificationEvent) => {
  NotificationManager.handleClick(event, self.clients);
});