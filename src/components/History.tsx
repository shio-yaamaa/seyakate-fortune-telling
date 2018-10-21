import * as React from 'react';
import './History.css';

import JSTDate from '../utility/JSTDate';
import Result from '../utility/Result';

interface HistoryProps {
  history: Map<JSTDate, Result>;
}

class History extends React.Component<HistoryProps> {
  public render() {
    console.log(history);
    if (this.props.history.size === 0) {
      return (
        <div className="history">
          <p>履歴</p>
          <p>履歴はまだありません</p>
        </div>
      );
    } else {
      return (
        <div className="history">
          <p>履歴</p>
          <table>
            <tbody>
              {Array.from(this.props.history.entries()).map(([date, result]) => {
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
