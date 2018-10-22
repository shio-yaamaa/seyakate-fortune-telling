import * as React from 'react';
import './Description.css';

class Description extends React.Component {
  // TODO: Should change depending on the Notification & Push support
  public render() {
    return (
      <section className="description">
        <p><a href={process.env.REACT_APP_SHINDAN_URL}>せやかて工藤占い</a>の結果を毎朝お届けします。名前を入力して、通知を有効にしてください。</p>
      </section>
    );
  }
}

export default Description;
