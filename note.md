# Todo

# Date/Time

This app only cares about JST.

# Unsubscribing script

```javascript
navigator.serviceWorker.ready.then(registration =>
  registration.pushManager.getSubscription().then(subscription =>
    subscription.unsubscribe().then(() =>
      console.log('Unsubscribed');
    )
  )
);
```

# Manipulating IndexedDB from the browser console

1. Add Dexie script and define the table schema

```javascript
const script = document.createElement('script');
script.addEventListener('load', () => {
  db = new Dexie('LocalDatabase');
  db.version(1).stores({ configs: 'key, value', results: 'date, chars, distance' });
});
script.setAttribute('src', 'https://unpkg.com/dexie@latest/dist/dexie.js');
document.body.append(script);
```

2. Do whatever operation you like

- Add: `db.results.add({date: , chars: [], distance: });`
- Update: `db.results.put({date: , chars: [], distance: });`
- Delete: `db.results.delete();` The argument is the primary key (date)

# Component Structure

```xml
<App>
  <Description>
  <NameInput>
  <NotificationToggle>
  <TodaysResult>
  <History>
  <Statistics>
```

curl https://me6hh9ycq9.execute-api.ap-northeast-1.amazonaws.com/default/seyakate-fortune-telling-write-subscriptions --request POST --header "Content-Type: application/json" --data '{"operation": "create", "subscription": {"endpoint": "aaa", "keys": {"p256dh": "bbb", "auth": "ccc"}}, "subscriptionId": "ddd"}'

curl https://0u3uohct72.execute-api.ap-northeast-1.amazonaws.com/default/seyakate-fortune-telling-fetch-result --header "Content-Type: application/json" --data '{"name": "yaamaa"}'