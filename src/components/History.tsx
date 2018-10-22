import * as React from 'react';
import './History.css';

import { HISTORY_COUNT } from '../utility/constants';

import JSTDate from '../utility/JSTDate';
import LocalDatabase from '../utility/LocalDatabase';
import Result from '../utility/Result';

interface HistoryProps {
  isVisible: boolean;
}

interface HistoryState {
  history: Map<JSTDate, Result>;
}

class History extends React.Component<HistoryProps, HistoryState> {
  constructor(props: HistoryProps) {
    super(props);
    this.state = {
      history: new Map<JSTDate, Result>()
    };

    LocalDatabase.getRecentResultsWithDates(HISTORY_COUNT).then(history => {
      this.setState({ history });
    });
  }

  public render() {
    if (!this.props.isVisible) return null;
    if (this.state.history.size === 0) {
      return (
        <div className="history">
          <p>履歴</p>
          <p>履歴はまだありません</p>
        </div>
      );
    } else {
      return (
        <div className="history">
          <p>最近の履歴</p>
          <table>
            <tbody>
              {Array.from(this.state.history.entries()).map(([date, result]) => {
                return (
                  <tr key={date.toKeyString()}>
                    <td>{date.toDisplayString()}</td>
                    <td>{result.toString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    }
  }
}

export default History;
