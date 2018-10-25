import Result from '../utility/Result';

const fetchResult = async (name: string): Promise<Result> => {
  const response = await fetch(
    process.env.REACT_APP_FETCH_RESULT_ENDPOINT!,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify({ name })
    }
  );
  const responseData = await response.json();
  return Result.fromString(responseData.result);
};

export default fetchResult;