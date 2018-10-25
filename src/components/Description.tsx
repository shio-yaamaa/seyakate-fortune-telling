import * as React from 'react';
import './Description.css';

interface DescriptionProps {
  isIndexedDBSupported: boolean;
  isPushSupported: boolean;
}

class Description extends React.Component<DescriptionProps> {
  public render() {
    let warning = null;
    if (!this.props.isIndexedDBSupported) {
      warning = <p className="warning"><i className="fas fa-exclamation-circle" />
        このブラウザでは、このページの機能に必要なデータベースがサポートされていません。
      </p>;
    } else if (!this.props.isPushSupported) {
      warning = <p className="warning"><i className="fas fa-exclamation-circle" />
        このブラウザには通知機能が備わっていません。結果取得機能と履歴保存機能のみお使いいただけます。
      </p>;
    }

    return (
      <section className="description">
        <p><a href={process.env.REACT_APP_SHINDAN_URL}>せやかて工藤診断</a>の結果を毎朝お届けします。名前を入力して、通知を有効にしてください。</p>
        {warning}
      </section>
    );
  }
}

export default Description;
