# Todo

# Date/Time

This app only cares about JST.

# Unsubscribing script

```javascript
navigator.serviceWorker.ready.then(registration =>
  registration.pushManager.getSubscription().then(subscription =>
    subscription.unsubscribe().then(() =>
      console.log('Unsubscribed!')
    )
  )
);
```

# Component Structure

```xml
<App>
  <Description>
  <NameInput>
  <NotificationToggle>
  <TodaysResult>
  <History>
  <Distribution>
```

curl https://me6hh9ycq9.execute-api.ap-northeast-1.amazonaws.com/default/seyakate-fortune-telling-write-subscriptions --request POST --header "Content-Type: application/json" --data '{"operation": "create", "subscription": {"endpoint": "aaa", "keys": {"p256dh": "bbb", "auth": "ccc"}}, "subscriptionId": "ddd"}'

curl https://0u3uohct72.execute-api.ap-northeast-1.amazonaws.com/default/seyakate-fortune-telling-fetch-result --header "Content-Type: application/json" --data '{"name": "yaamaa"}'