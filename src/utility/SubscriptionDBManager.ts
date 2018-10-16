import axios from 'axios';

class SubscriptionDBManager {
  public async addSubscription(subscription: PushSubscription): Promise<string | null> {
    const subscriptionWithKeys = JSON.parse(JSON.stringify(subscription));
    const postParams = {
      operation: 'create',
      subscription: {
        endpoint: subscriptionWithKeys.endpoint,
        keys: {
          p256dh: subscriptionWithKeys.keys.p256dh,
          auth: subscriptionWithKeys.keys.auth
        }
      }
    };

    try {
      const response = await axios.post(process.env.REACT_APP_SUBSCRIPTION_WRITE_ENDPOINT!, postParams)
      console.log(response);
      // TODO: もしresponseにerrorが含まれてたらcatchに移行
      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  public async deleteSubscription(subscriptionId: string): Promise<string | null> {
    // TODO
    return new Promise<string | null>((resolve, reject) => {resolve('')});
  }
}

export default new SubscriptionDBManager();