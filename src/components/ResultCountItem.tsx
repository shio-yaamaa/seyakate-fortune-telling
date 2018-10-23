import * as React from 'react';
import './ResultCountItem.css';

interface ResultCountItemProps {
  resultString: string;
  count: number;
  color: 'gray' | 'red' | 'green' | 'blue'; 
}

class ResultCountItem extends React.Component<ResultCountItemProps> {
  private colorMap = new Map<string, string>([
    ['gray', '#BDBDBD'], // Gray 400
    ['red', '#E57373'], // Red 300
    ['green', '#66BB6A'], // Green 400
    ['blue', '#42A5F5'] // Blue 400
  ]);

  public render() {
    return (
      <div
        className="result-count-item"
        style={{
          border: `1px solid ${this.colorMap.get(this.props.color)}`
        }} >
        <p className="result-count-item-result">{this.props.resultString}</p>
        <p className="result-count-item-count">{this.props.count}回</p>
      </div>
    );
  }
}

export default ResultCountItem;
