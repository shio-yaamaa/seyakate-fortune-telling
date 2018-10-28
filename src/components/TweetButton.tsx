import * as React from 'react';
import './TweetButton.css';

import Result from '../utility/Result';
import { constructQueryParams } from '../utility/utility';

const HASH_TAG = '#せやかて工藤';

interface TweetButtonProps {
  todaysResult: Result;
}

class TweetButton extends React.Component<TweetButtonProps> {
  public render() {
    const tweetText = this.props.todaysResult.toString()
      + '\n' + HASH_TAG
      + '\n' + process.env.REACT_APP_SHINDAN_URL;
    const queryParamsMap = new Map<string, string>([
      ['ref_src', 'twsrc%5Etfw'],
      ['text', tweetText]
    ]);
    const queryParams = constructQueryParams(queryParamsMap);
    
    return (
      <div className="tweet-button">
        <a
          className="twitter-share-button"
          href={`https://twitter.com/intent/tweet${queryParams}`}
          target="_blank"
          data-show-count="false">
          結果をツイート
        </a>
      </div>
    );
  }
}

export default TweetButton;
