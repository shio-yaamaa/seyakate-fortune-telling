import * as React from 'react';
import './TodaysResult.css';

import Result from '../utility/Result';

interface TodaysResultProps {
  isFetching: boolean;
  todaysResult: Result | null;
}

class TodaysResult extends React.Component<TodaysResultProps> {
  public render() {
    const textContent = this.props.isFetching
      ? '取得中'
      : (this.props.todaysResult ? this.props.todaysResult.toString() : '取得できていません');
    return (
      <div className="todays-result">
        <p>{textContent}</p>
      </div>
    );
  }
}

export default TodaysResult;
