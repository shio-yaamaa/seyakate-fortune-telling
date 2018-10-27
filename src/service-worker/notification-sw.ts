import { DEFAULT_NAME } from '../utility/constants';

import JSTDate from '../utility/JSTDate';
import LocalDatabase from '../utility/LocalDatabase';

import NotificationManager from './NotificationManager';
import fetchResult from './fetchResult'; // Different from '../utility/fetchResult' in that it uses fetch API, which is available in Service Worker

declare var self: ServiceWorkerGlobalScope;

self.addEventListener('push', event => {
  const reactToPush = async () => {
    try {
      const resultInDB = await LocalDatabase.getResult(JSTDate.today());
      let newResult = null;
      if (resultInDB === null) {
        const name = await LocalDatabase.getName();
        if (name === null) throw Error('Could not fetch name from DB');
        newResult = await fetchResult(name === '' ? DEFAULT_NAME : name);
        LocalDatabase.setTodaysResult(newResult);
      }
  
      if (resultInDB === null && newResult === null) {
        throw Error('Result is not in the DB and could not fetched from the remote server');
      }
  
      await NotificationManager.showNotification(
        self.registration,
        resultInDB === null ? newResult! : resultInDB!,
        resultInDB !== null
      );
    } catch (error) {
      console.log(error);
    }
  }
  event.waitUntil(reactToPush());
});

self.addEventListener('notificationclick', (event: NotificationEvent) => {
  NotificationManager.handleClick(event, self.clients);
});