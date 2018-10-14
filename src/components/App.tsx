import * as React from 'react';
import './App.css';

import Description from './Description';
import NotificationToggle from './NotificationToggle';

import SubscriptionManager from '../utility/SubscriptionManager';

import { Result } from '../utility/Result';

interface AppState {
  name: string,
  todaysResult: Result | null
}

class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      name: '',
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
        <NotificationToggle toggleNotification={this.toggleNotification} />
      </div>
    );
  }
}

export default App;