import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './components/App';
import './index.css';
import { registerServiceWorker } from './serviceWorkerRegistration';

const isIndexedDBSupported = 'indexedDB' in window;
const isPushSupported = 'serviceWorker' in navigator
  && 'Notification' in window
  && 'PushManager' in window;

ReactDOM.render(
  <App
    isIndexedDBSupported={isIndexedDBSupported}
    isPushSupported={isPushSupported} />,
  document.getElementById('root') as HTMLElement
);

if (isIndexedDBSupported && isPushSupported) {
  registerServiceWorker();
}