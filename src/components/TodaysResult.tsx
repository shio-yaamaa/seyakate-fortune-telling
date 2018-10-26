import * as React from 'react';
import './TodaysResult.css';

import TweetButton from './TweetButton';

// import JSTDate from '../utility/JSTDate';
import LocalDatabase from '../utility/LocalDatabase';
import Result from '../utility/Result';
import fetchResult from '../utility/fetchResult';

interface TodaysResultProps {
  isVisible: boolean;
  isNameUpdated: boolean;
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
  }

  public componentDidUpdate(prevProps: TodaysResultProps) {
    if (!prevProps.isNameUpdated && this.props.isNameUpdated) {
      this.setState({ isFetching: true });
      this.fetchAndSetResult();
    }
  }

  private async fetchAndSetResult() {
    const name = await LocalDatabase.getName();
    if (name === null) return;
    fetchResult(name)
      .then((fetchedResult: Result) => {
        this.setState({ isFetching: false, todaysResult: fetchedResult });
        this.props.notifyResultDBUpdate();
      })
      .catch(error => {
        console.log('Failed to fetch today\'s result', error);
        this.setState({ isFetching: false, todaysResult: null });
      });
  }

  public render() {
    if (!this.props.isVisible) return null;
    const textContent = this.state.isFetching
      ? '取得中'
      : (this.state.todaysResult ? this.state.todaysResult.toString() : '取得できません');
    return (
      <section
        className={`todays-result ${(this.state.todaysResult && this.state.todaysResult.distance === 0) ? 'is-seyakate' : ''}`}>
        <p className="todays-result-title">今日の結果</p>
        <p className="todays-result-content">{textContent}</p>
        {!this.state.isFetching && this.state.todaysResult && <p className="todays-result-message">
          {this.state.todaysResult.distance === 0
            ? 'おめでとうございます！'
            : '明日も頑張りましょう。'}
        </p>}
        {this.state.todaysResult && <TweetButton todaysResult={this.state.todaysResult} />}
      </section>
    );
  }
}

export default TodaysResult;
