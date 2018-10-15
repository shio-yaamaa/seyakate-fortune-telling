This Lambda function accepts HTTP requests and executes the requested DB operation with the specified subscription data.
It returns a subscription ID string (or an empty string if the operation has failed).

# Requests

## Create a subscription

```json
{
  "operation": "create",
  "subscription": {
    "endpoint": "",
    "keys": {
      "p256dh": "",
      "auth": ""
    }
  }
}
```

## Delete a subscription

```json
{
  "operation": "delete",
  "subscriptionId": ""
}
```

When a subscription with the specified ID doesn't exist, the function does nothing and returns the ID.

# Commands

## Compile

`GOOS=linux GOARCH=amd64 go build -o main main.go`

## Zip

`zip main.zip main`