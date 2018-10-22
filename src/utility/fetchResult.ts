import axios from 'axios';

import { DEFAULT_NAME } from './constants';

import Result from './Result';
import LocalDatabase from './LocalDatabase';

const fetchResult = async (name: string): Promise<Result> => {
  const response = await axios.post(
    process.env.REACT_APP_FETCH_RESULT_ENDPOINT!,
    { name: name === "" ? DEFAULT_NAME : name }
  );
  if (response.status === 500) {
    throw Error('Internal server error');
  }
  const result = Result.fromString(response.data.result);
  LocalDatabase.setTodaysResult(result);
  return result;
};

export default fetchResult;