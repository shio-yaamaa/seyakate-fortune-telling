import * as React from 'react';
import './Statistics.css';

import ResultCountItem from './ResultCountItem';
import NoItem from './NoItem';

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
      return <NoItem message={`${distance === 2 ? 'ちょっと' : ''}惜しかったことはありません`} />;
    }
    return (
      <div className="result-count-item-container">
        {Array.from(closeResults.entries()).map(([result, count]) => {
          const resultString = result.toString();
          return (
            <ResultCountItem
              key={resultString}
              resultString={resultString}
              count={count}
              color={distance === 1 ? 'green' : 'blue'} />
          );
        })}
      </div>
    );
  }

  public render() {
    if (!this.props.isVisible) return null;
    return (
      <section className="statistics">
        <h1>回数</h1>
        <ResultCountItem
          resultString={'せやかて工藤'}
          count={this.state.seyakateCount}
          color="red" />
        <h2>惜しい</h2>
        {this.createCloseResultList(1, this.state.closeResults)}
        <h2>ちょっと惜しい</h2>
        {this.createCloseResultList(2, this.state.bitCloseResults)}
      </section>
    );
  }
}

export default Statistics;
