import SubscriptionDBManager from './SubscriptionDBManager';
import LocalDatabase from './LocalDatabase';
import { urlBase64ToUint8Array } from './utility';

class SubscriptionManager {
  // Create a new subscription and register its data to the DB
  public async subscribe() {
    if (!('serviceWorker' in navigator)) {
      alert('このブラウザはService Workerをサポートしていません');
      return;
    }
    
    try {
      const registration = await navigator.serviceWorker.ready;
      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) {
        console.log('Subscription already exists', existingSubscription);
      } else {
        const newSubscription = await this.createSubscription(registration);
        console.log('New subscription', JSON.parse(JSON.stringify(newSubscription)));
        const id = await this.addSubscriptionToRemoteDB(newSubscription);
        await LocalDatabase.setSubscriptionId(id);
      }
    } catch (error) {
      console.log(error);
      alert('Subscribe時にエラーが発生しました');
    }
  }
  
  private async createSubscription(registration: ServiceWorkerRegistration): Promise<PushSubscription> {
    return registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(process.env.REACT_APP_VAPID_PUBLIC_KEY!)
    });
  }
  
  private async addSubscriptionToRemoteDB(subscription: PushSubscription): Promise<string> {
    console.log('Subscription to register: ', subscription);
    const id = await SubscriptionDBManager.addSubscription(subscription);
    console.log('Subscription ID:', id);
    if (id) {
      return id;
    } else {
      throw new Error('Error adding a subscription to remote DB');
    }
  }

  public async unsubscribe() {
    try {
      // Remove subscription data from DB
      const subscriptionId = await LocalDatabase.getSubscriptionId();
      if (!subscriptionId) {
        throw new Error('Local DB failed');
      }
      const subscriptionIdFromDB = await SubscriptionDBManager.deleteSubscription(subscriptionId);
      if (!subscriptionIdFromDB) {
        throw new Error('Remote DB failed');
      }
      await LocalDatabase.unsetSubscription();

      // Cancel the actual subscription
      const registration = await navigator.serviceWorker.ready;
      await this.clearSubscription(registration);
    } catch (error) {
      console.log(error);
      alert('Unsubscribe時にエラーが発生しました');
    }
  }

  private async clearSubscription(registration: ServiceWorkerRegistration) {
    const subscription = await registration.pushManager.getSubscription();
    subscription && await subscription.unsubscribe();
  }
}

export default new SubscriptionManager();