import * as React from 'react';
import './App.css';

import Description from './Description';
import NameInput from './NameInput';
import NotificationToggle from './NotificationToggle';
import TodaysResult from './TodaysResult';
import History from './History';
import Statistics from './Statistics';

import LocalDatabase from '../utility/LocalDatabase';

interface AppProps {
  isIndexedDBSupported: boolean;
  isPushSupported: boolean;
}

interface AppState {
  name: string;
  isResultDBUpdated: boolean; // To reflect the result fetched by TodaysResult in Statitics rendering
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      name: '',
      isResultDBUpdated: false
    };

    LocalDatabase.getName().then((name: string) => {
      this.setState({ name });
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

  private notifyResultDBUpdate = () => {
    this.setState({ isResultDBUpdated: true });
  };

  public render() {
    return (
      <div className="app">
        <Description
          isIndexedDBSupported={this.props.isIndexedDBSupported}
          isPushSupported={this.props.isPushSupported} />
        {this.props.isIndexedDBSupported && <NameInput
          name={this.state.name}
          setName={this.setName} />}
        {this.props.isIndexedDBSupported && this.props.isPushSupported && <NotificationToggle
          isVisible={this.state.name !== ''} />}
        {this.props.isIndexedDBSupported && <TodaysResult
          isVisible={this.state.name !== ''}
          name={this.state.name}
          notifyResultDBUpdate={this.notifyResultDBUpdate} />}
        {this.props.isIndexedDBSupported && <History
          isVisible={this.state.name !== ''} />}
        {this.props.isIndexedDBSupported && <Statistics
          isVisible={this.state.name !== ''}
          isUpdated={this.state.isResultDBUpdated} />}
      </div>
    );
  }
}

export default App;
