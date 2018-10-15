import SubscriptionDBManager from './SubscriptionDBManager';
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
        this.addSubscriptionToDB(newSubscription);
      }
    } catch (error) {
      alert('Subscribe時にエラーが発生しました');
    }
  }
  
  private async createSubscription(registration: ServiceWorkerRegistration): Promise<PushSubscription> {
    return registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(process.env.REACT_APP_VAPID_PUBLIC_KEY!)
    });
  }
  
  // Add subscription data to Dynamo DB
  private async addSubscriptionToDB(subscription: PushSubscription) {
    console.log('Subscription to register: ', subscription);
    const id = await SubscriptionDBManager.addSubscription(subscription);
    console.log('Subscription ID:', id);
    // TODO: Save the ID
  }

  public unsubscribe() {
    // TODO
  }
}

export default new SubscriptionManager();