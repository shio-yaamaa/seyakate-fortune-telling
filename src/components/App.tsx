import * as React from 'react';
import './App.css';

import Description from './Description';
import NotificationToggle from './NotificationToggle';

import SubscriptionManager from '../utility/SubscriptionManager';

import { Result } from '../utility/Result';

interface AppProps {
  isPushSupported: boolean;
}

interface AppState {
  name: string,
  todaysResult: Result | null
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
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
        <NotificationToggle
          isPushSupported={this.props.isPushSupported}
          toggleNotification={this.toggleNotification} />
      </div>
    );
  }
}

export default App;
