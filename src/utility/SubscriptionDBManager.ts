class SubscriptionDBManager {
  public async addSubscription(subscription: PushSubscription): Promise<string> {
    const subscriptionWithKeys = JSON.parse(JSON.stringify(subscription));
    // TODO
  }

  public async deleteSubscription(subscriptionId: string): Promise<> {
    // TODO
  }
}

export default new SubscriptionDBManager();