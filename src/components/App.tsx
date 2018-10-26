import * as React from 'react';
import './App.css';

import Description from './Description';
import NameInput from './NameInput';
import NotificationToggle from './NotificationToggle';
import TodaysResult from './TodaysResult';
import History from './History';
import Statistics from './Statistics';

interface AppProps {
  isIndexedDBSupported: boolean;
  isPushSupported: boolean;
}

interface AppState {
  isNameUpdated: boolean; // To trigger a new fetch in TodaysResult component
  isResultDBUpdated: boolean; // To reflect the result fetched by TodaysResult in Statitics rendering
  isFullContentAvailable: boolean; // Whether to show the components other than NameInput. True when the name is set
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      isNameUpdated: false,
      isResultDBUpdated: false,
      isFullContentAvailable: false
    };
  }

  public componentDidUpdate(prevProps: AppProps, prevState: AppState) {
    if (prevState.isNameUpdated || prevState.isResultDBUpdated) {
      this.setState({
        isNameUpdated: false,
        isResultDBUpdated: false
      });
    }
  }

  private notifyNameUpdate = () => {
    this.setState({
      isNameUpdated: true,
      isFullContentAvailable: true
    });
  };

  private notifyResultDBUpdate = () => {
    this.setState({ isResultDBUpdated: true });
  };

  public render() {
    return (
      <div className="app">
        <Description
          isIndexedDBSupported={this.props.isIndexedDBSupported}
          isPushSupported={this.props.isPushSupported} />
        {this.props.isIndexedDBSupported &&
          <NameInput
            notifyNameUpdate={this.notifyNameUpdate} />}
        {this.props.isIndexedDBSupported && this.props.isPushSupported &&
          <NotificationToggle
            isVisible={this.state.isFullContentAvailable} />}
        {this.props.isIndexedDBSupported &&
          <TodaysResult
            isVisible={this.state.isFullContentAvailable}
            isNameUpdated={this.state.isNameUpdated}
            notifyResultDBUpdate={this.notifyResultDBUpdate} />}
        {this.props.isIndexedDBSupported &&
          <History
            isVisible={this.state.isFullContentAvailable} />}
        {this.props.isIndexedDBSupported &&
          <Statistics
            isVisible={this.state.isFullContentAvailable}
            isUpdated={this.state.isResultDBUpdated} />}
      </div>
    );
  }
}

export default App;
