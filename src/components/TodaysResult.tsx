import * as React from 'react';
import './TodaysResult.css';

import JSTDate from '../utility/JSTDate';
import LocalDatabase from '../utility/LocalDatabase';
import Result from '../utility/Result';
import fetchResult from '../utility/fetchResult';

interface TodaysResultProps {
  isVisible: boolean;
  name: string;
  notifyResultDBUpdate: () => void;
}

interface TodaysResultState {
  isFetching: boolean;
  todaysResult: Result | null;
}

class TodaysResult extends React.Component<TodaysResultProps, TodaysResultState> {
  constructor(props: TodaysResultProps) {
    super(props);
    this.state = {
      isFetching: true,
      todaysResult: null
    };
    // If today's result is not stored in IndexedDB, go get it
    LocalDatabase.getResult(JSTDate.today()).then((result: Result | null) => {
      if (result) {
        this.setState({ isFetching: false, todaysResult: result });
      } else {
        this.fetchAndSetResult(this.props.name);
      }
    });
  }

  public componentDidUpdate(prevProps: TodaysResultProps) {
    if (prevProps.name !== this.props.name) {
      this.setState({ isFetching: true });
      this.fetchAndSetResult(this.props.name);
    }
  }

  private fetchAndSetResult(name: string) {
    fetchResult(name)
      .then((fetchedResult: Result) => {
        this.setState({ isFetching: false, todaysResult: fetchedResult });
        this.props.notifyResultDBUpdate();
      })
      .catch(error => {
        console.log(error);
        this.setState({ isFetching: false, todaysResult: null });
      });
  }

  public render() {
    if (!this.props.isVisible) return null;
    const textContent = this.state.isFetching
      ? '取得中'
      : (this.state.todaysResult ? this.state.todaysResult.toString() : '取得できていません');
    return (
      <div className="todays-result">
        <p>今日の結果</p>
        <p>{textContent}</p>
      </div>
    );
  }
}

export default TodaysResult;
