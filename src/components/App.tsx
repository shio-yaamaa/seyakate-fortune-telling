import * as React from 'react';
import './App.css';

import Description from './Description';
import NameInput from './NameInput';
import NotificationToggle from './NotificationToggle';

import SubscriptionManager from '../utility/SubscriptionManager';
import LocalDatabase from '../utility/LocalDatabase';

import Result from '../utility/Result';

interface AppProps {
  isPushSupported: boolean;
}

interface AppState {
  name: string,
  isSubscriptionDBProcessing: boolean, // True while waiting for a response from Lambda
  isNotificationEnabled: boolean,
  todaysResult: Result | null
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      name: '',
      isSubscriptionDBProcessing: false,
      isNotificationEnabled: false,
      todaysResult: null
    };

    LocalDatabase.getName().then((name: string) => {
      this.setState({name});
    });
    LocalDatabase.getIsNotificationEnabled().then((isNotificationEnabled: boolean) => {
      this.setState({isNotificationEnabled});
    });
  }

  private setName = (name: string) => {
    LocalDatabase.setName(name);
    this.setState({name});
    // TODO: Retrieve the result again!
  }

  private toggleNotification = (enable: boolean) => {
    if (enable) {
      SubscriptionManager.subscribe().then(() => {
        this.setState({
          isSubscriptionDBProcessing: false,
          isNotificationEnabled: true
        });
      });
    } else {
      SubscriptionManager.unsubscribe().then(() => {
        this.setState({
          isSubscriptionDBProcessing: false,
          isNotificationEnabled: false
        });
      });
    }
    this.setState({isSubscriptionDBProcessing: true});
  };

  public render() {
    return (
      <div className="app">
        <Description />
        <NameInput
          name={this.state.name}
          setName={this.setName} />
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
