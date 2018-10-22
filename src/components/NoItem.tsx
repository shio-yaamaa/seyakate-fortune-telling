import * as React from 'react';
import './NoItem.css';

interface NoItemProps {
  message: string;
}

class NoItem extends React.Component<NoItemProps> {
  public render() {
    return (
      <div className="no-item">
        <p>{this.props.message}</p>
      </div>
    );
  }
}

export default NoItem;
