import * as React from 'react';
import './Statistics.css';

import LocalDatabase from '../utility/LocalDatabase';
import Result from '../utility/Result';

interface StatisticsProps {
  isVisible: boolean;
  isUpdated: boolean; // Corresponds to App's isResultDBUpdated
}

interface StatisticsState {
  seyakateCount: number;
  closeResults: Map<Result, number>;
  bitCloseResults: Map<Result, number>;
}

class Statistics extends React.Component<StatisticsProps, StatisticsState> {
  constructor(props: StatisticsProps) {
    super(props);
    this.state = {
      seyakateCount: 0,
      closeResults: new Map<Result, number>(),
      bitCloseResults: new Map<Result, number>()
    };

    this.fetchMetrics();
  }

  public componentDidUpdate(prevProps: StatisticsProps) {
    if (!prevProps.isUpdated && this.props.isUpdated) {
      this.fetchMetrics();
    }
  }

  private fetchMetrics() {
    console.log('fetching metrics');
    LocalDatabase.getSeyakateCount().then(count => {
      this.setState({ seyakateCount: count });
    });
    LocalDatabase.getResultsFilteredByDistance(1).then(results => {
      this.setState({ closeResults: results });
    });
    LocalDatabase.getResultsFilteredByDistance(2).then(results => {
      this.setState({ bitCloseResults: results });
    });
  }

  private createCloseResultList(distance: number, closeResults: Map<Result, number>): JSX.Element {
    if (closeResults.size === 0) {
      return <p>{distance === 2 ? 'ちょっと' : ''}惜しかったことはありません</p>;
    }
    return (
      <div>
        {Array.from(closeResults.entries()).map(([result, count]) => {
          const resultString = result.toString();
          return <p key={resultString}>{resultString} {count}</p>
        })}
      </div>
    );
  }

  public render() {
    if (!this.props.isVisible) return null;
    return (
      <div className="statistics">
        <p>記録</p>
        <p>せやかて工藤: {this.state.seyakateCount}回</p>
        <p>惜しい</p>
        {this.createCloseResultList(1, this.state.closeResults)}
        <p>ちょっと惜しい</p>
        {this.createCloseResultList(2, this.state.bitCloseResults)}
      </div>
    );
  }
}

export default Statistics;
