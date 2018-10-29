# Browser Support

```javascript
if (IndexedDB is supported) {
  if (ServiceWorker, Notification, and PushManager are supported) {
    Full functionality is available.
  } else {
    You cannot receive push notifications but still can retrieve and save data.
    NotificationToggle component should not be visible.
  }
  // IndexedDB does not keep its data across sessions in private browsing mode in many browsers. Nevertheless 'indexedDB in window' evaluates to true and there seems to be no standardized way to detect private browsing mode.
} else {
  No functionality is available since IndexedDB is used to store all the data including configs and result history.
}
```

## MacOS

|                     |IndexedDB|Notification and Push|
|:--------------------|:-------:|:-------------------:|
|Chrome               |YES      |YES                  |
|Firefox              |YES      |YES                  |
|Safari               |YES      |NO                   |

Safari needs [Safari Push Notifications](https://developer.apple.com/notifications/safari-push-notifications/) to send/receive push notifications.

Firefox private browsing mode refuses IndexedDB mutation and yields errors in the console, but they are not user-visible.

## Windows

|                     |IndexedDB|Notification and Push|
|:--------------------|:-------:|:-------------------:|
|Chrome               |YES      |YES                  |
|Edge                 |YES      |YES                  |
|Firefox              |YES      |YES                  |

Firefox's notification isn't kept in the notification area.
Only Edge can receive notifications even when the browser is closed?

Gave up on IE 11 because it lacks so many language features.

## iOS

|                     |IndexedDB|Notification and Push|
|:--------------------|:-------:|:-------------------:|
|Safari               |YES      |NO                   |

Confirmed on iOS 9.3 using Simulator.

## Android

|                     |IndexedDB|Notification and Push|
|:--------------------|:-------:|:-------------------:|
|Default browser      |YES      |NO                   |
|Chrome               |YES      |YES                  |
|Firefox              |YES      |YES                  |

# Date/Time

This app only cares about JST.

# Manipulating IndexedDB from the browser console

1. Add Dexie script and define the table schema

```javascript
const script = document.createElement('script');
let db;
script.addEventListener('load', () => {
  db = new Dexie('LocalDatabase');
  db.version(1).stores({ configs: 'key, value', results: 'date, chars, distance' });
});
script.setAttribute('src', 'https://unpkg.com/dexie@latest/dist/dexie.js');
document.body.appendChild(script);
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
    <ResultCountItem> x ?
```