const AWS = require('aws-sdk');
const webpush = require('web-push');

const docClient = new AWS.DynamoDB.DocumentClient({region: 'ap-northeast-1'});

const sendPushNotification = async (subscription) => {
  webpush.setVapidDetails(
    `mailto:${process.env.EMAIL}`, // Identifier
    process.env.VAPID_PUBLIC_KEY, // Public key
    process.env.VAPID_PRIVATE_KEY // Private key
  );
  
  const pushConfig = {
    endpoint: subscription.endpoint,
    keys: {
      auth: subscription.keys.auth,
      p256dh: subscription.keys.p256dh
    }
  };
  
  try {
    await webpush.sendNotification(pushConfig, '');
  } catch (error) {
    console.log('Error sending notifications', error);
  }
};

exports.handler = async (event) => {
  // Send push notification to every subscription registered
  const params = {
    TableName: process.env.SUBSCRIPTION_TABLE_NAME
  };
  return new Promise((resolve, reject) => {
    docClient.scan(params, async (error, data) => {
      if (error) {
        console.log('Error scanning the table:', error);
        reject();
      } else {
        for (const subscription of data.Items) {
          await sendPushNotification(subscription);
        }
      }
      
      const response = {
        statusCode: 200
      };
      resolve(response);
    });
  });
};