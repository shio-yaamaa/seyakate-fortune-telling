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
        console.log('subscription already exists', existingSubscription);
      } else {
        const newSubscription = await this.createSubscription(registration);
        console.log('newSubscription', newSubscription);
        console.log('JSON', JSON.stringify(newSubscription));
        // this.registerSubscriptionInDB(newSubscription);
      }
    } catch (error) {
      alert('Subscribe時にエラーが発生しました');
    }
  }
  
  private async createSubscription(registration: ServiceWorkerRegistration): Promise<PushSubscription> {
    return registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(process.env.VAPID_PUBLIC_KEY!)
    });
  }
  
  // Add subscription data to the firestore DB
  // private registerSubscriptionInDB(subscription: PushSubscription) {
  //   console.log('Subscription to register: ', subscription);
    
  //   const db = firebase.firestore();
  //   const subscriptionWithStringKeys = JSON.parse(JSON.stringify(subscription)); // Needed to get keys as strings
  //   db.collection('subscriptions').add(Object.assign(
  //     subscriptionWithStringKeys,
  //     {
  //       createdAt: Date.now(),
  //       updatedAt: Date.now()
  //     }
  //   ))
  //   .then((docRef: firebase.firestore.DocumentReference) => {
  //     console.log('Document written with ID: ', docRef.id);
  //   })
  //   .catch((error: Error) => {
  //     console.log(error);
  //   });
  // }

  public unsubscribe() {
    // TODO
  }
}

export default new SubscriptionManager();