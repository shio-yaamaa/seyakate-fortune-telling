import * as React from 'react';
import './App.css';

import Description from './Description';
import NotificationToggle from './NotificationToggle';

import SubscriptionManager from '../utility/SubscriptionManager';
import IndexedDBManager from '../utility/IndexedDBManager';

import { Result } from '../utility/Result';

interface AppProps {
  isPushSupported: boolean;
}

interface AppState {
  name: string,
  isSubscriptionDBProcessing: boolean,
  isNotificationEnabled: boolean,
  todaysResult: Result | null
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      name: IndexedDBManager.name,
      isSubscriptionDBProcessing: false,
      isNotificationEnabled: IndexedDBManager.isNotificationEnabled,
      todaysResult: null
    };
  }

  private toggleNotification = (enable: boolean) => {
    if (enable) {
      SubscriptionManager.subscribe();
    } else {
      SubscriptionManager.unsubscribe();
    }
  };

  public render() {
    return (
      <div className="app">
        <Description />
        <NotificationToggle
          isPushSupported={this.props.isPushSupported}
          isSubscriptionDBProcessing={this.state.isSubscriptionDBProcessing}
          isNotificationEnabled={this.state.isNotificationEnabled}
          toggleNotification={this.toggleNotification} />
      </div>
    );
  }
}

export default App;
