import * as React from 'react';
import './App.css';

import Description from './Description';
import NameInput from './NameInput';
import NotificationToggle from './NotificationToggle';
import TodaysResult from './TodaysResult';
import History from './History';
import Statistics from './Statistics';

import SubscriptionManager from '../utility/SubscriptionManager';
import LocalDatabase from '../utility/LocalDatabase';

interface AppProps {
  isPushSupported: boolean;
}

interface AppState {
  name: string;
  isSubscriptionDBProcessing: boolean; // True while waiting for a response from Lambda
  isNotificationEnabled: boolean;
  isResultDBUpdated: boolean;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      name: '',
      isSubscriptionDBProcessing: false,
      isNotificationEnabled: false,
      isResultDBUpdated: false
    };

    LocalDatabase.getName().then((name: string) => {
      this.setState({ name });
    });
    LocalDatabase.getIsNotificationEnabled().then((isNotificationEnabled: boolean) => {
      this.setState({ isNotificationEnabled });
    });
  }

  public componentDidUpdate(prevProps: AppProps, prevState: AppState) {
    if (prevState.isResultDBUpdated) {
      this.setState({ isResultDBUpdated: false });
    }
  }

  private setName = (name: string) => {
    LocalDatabase.setName(name);
    this.setState({ name });
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

  private notifyResultDBUpdate = () => {
    this.setState({ isResultDBUpdated: true });
  };

  public render() {
    return (
      <div className="app">
        <Description />
        <NameInput
          name={this.state.name}
          setName={this.setName} />
        <NotificationToggle
          isVisible={this.state.name !== ''}
          isPushSupported={this.props.isPushSupported}
          isSubscriptionDBProcessing={this.state.isSubscriptionDBProcessing}
          isNotificationEnabled={this.state.isNotificationEnabled}
          toggleNotification={this.toggleNotification} />
        <TodaysResult
          isVisible={this.state.name !== ''}
          name={this.state.name}
          notifyResultDBUpdate={this.notifyResultDBUpdate} />
        <History
          isVisible={this.state.name !== ''} />
        <Statistics
          isVisible={this.state.name !== ''}
          isUpdated={this.state.isResultDBUpdated} />
      </div>
    );
  }
}

export default App;
