import * as uuidv5 from 'uuid/v5';
import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const SUBSCRIPTION_TABLE_NAME = 'seyakate-fortune-telling-subscriptions';
const SUBSCRIPTION_UUID_NAMESPACE = '6b612456-71fc-4fc2-a8ec-e45ca8589a01';

class DynamoDBManager {
  private docClient: DocumentClient;

  constructor() {
    // AWS.config.update({
    //   region: 'ap-northeast-1'
    // });
    this.docClient = new AWS.DynamoDB.DocumentClient({
      region: 'ap-northeast-1',
      endpoint: 'dynamodb.ap-northeast-1.amazonaws.com',
      accessKeyId: process.env.REACT_APP_DYNAMODB_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_DYNAMODB_SECRET_ACCESS_KEY
    });
  }

  public async addSubscription(subscription: PushSubscription): Promise<string> {
    const subscriptionWithKeys = JSON.parse(JSON.stringify(subscription));
    const id = uuidv5(subscriptionWithKeys.endpoint, SUBSCRIPTION_UUID_NAMESPACE)
    const params = {
      TableName: SUBSCRIPTION_TABLE_NAME,
      Item: {
        id,
        endpoint: subscriptionWithKeys.endpoint,
        expirationTime: subscriptionWithKeys.expirationTime,
        keys: {
          p256dh: (subscriptionWithKeys as any).keys.p256dh,
          auth: (subscriptionWithKeys as any).keys.auth
        }
      }
    }

    return new Promise<string>((resolve, reject) => {
      this.docClient.put(params, (error, data) => {
        if (error) {
          console.error('Error adding a subscription:', error);
          reject();
        } else {
          console.log('Successfully added a subscription', data);
          resolve(id);
        }
      });
    });
  }
}

export default new DynamoDBManager();