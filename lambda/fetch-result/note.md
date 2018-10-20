This Lambda function fetches the result of せやかて工藤診断 from 診断メーカー with the specified name and returns the result.

# Request

```json
{
    "name": ""
}
```

# Response

```json
{
    "result": "せせやて工藤" // Just an example
}
```

or 500 if an error occurs in the fetching process, such as "no such host" or "cannot find the specified HTML element".

(The `OnError` method, which is supposed to take "no such host" error, is not properly triggered now.)

# Commands

## Compile

`GOOS=linux GOARCH=amd64 go build -o main main.go`

## Zip

`zip main.zip main`