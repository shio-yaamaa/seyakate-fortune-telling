import axios from 'axios';

class SubscriptionDBManager {
  // Returns the subscription ID if the subscription is successfully added; null otherwise.
  public async addSubscription(subscription: PushSubscription): Promise<string | null> {
    const subscriptionWithKeys = JSON.parse(JSON.stringify(subscription));
    const data = {
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
      const response = await axios.post(process.env.REACT_APP_WRITE_SUBSCRIPTIONS_ENDPOINT!, data);
      if (response.data.isError) throw new Error('The Lambda function returned an error');
      return response.data.subscriptionId;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // Returns the subscription ID if the subscription is successfully deleted; null otherwise.
  public async deleteSubscription(subscriptionId: string): Promise<string | null> {
    const data = {
      operation: 'delete',
      subscriptionId
    }

    try {
      const response = await axios.post(process.env.REACT_APP_WRITE_SUBSCRIPTIONS_ENDPOINT!, data);
      if (response.data.isError) throw new Error('The Lambda function returned an error');
      return response.data.subscriptionId;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default new SubscriptionDBManager();