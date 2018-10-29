# About

This website notifies you of the result of [せやかて工藤診断](https://shindanmaker.com/735043) every morning (at around 6 AM JST). It doesn't provide the notification feature on devices and browsers that do not support [Push API](https://caniuse.com/#search=Push%20API). It can still fetch today's result and store the result history on those devices.

# Unsubscribing script

If the app fails to unsubscribe from push messages and keeps sending you notifications that you don't want, execute the following script in the browser console to force unsubscription. Do not use it if unticking the subscription checkbox works fine since this script might bring about an inconsistency between the local state and the remote DB.

```javascript
navigator.serviceWorker.ready.then(registration =>
  registration.pushManager.getSubscription().then(subscription =>
    subscription.unsubscribe().then(() =>
      console.log('Unsubscribed')
    )
  )
);
```