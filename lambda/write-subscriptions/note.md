This Lambda function accepts HTTP requests and executes the requested DB operation with the specified subscription data.

# Requests

## Creating a subscription

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

The ID of a subscription is based on its endpoint, which means the two subscriptions with the same endpoint will have the same ID.
When the client requests to create a subscription and there is already a subscription with the same endpoint, the new subscription will overwrite the existing one.

## Deleting a subscription

```json
{
  "operation": "delete",
  "subscriptionId": ""
}
```

When a subscription with the specified ID doesn't exist, the function does nothing and just returns the normal response.

# Responses

Regardless of the requested operation type, the response will have the same format as follows:

```json
{
  "subscriptionId": "",
  "isError": true/false
}
```

When `isError` is true, `subscriptionId` might be empty.

# Commands

## Compile

`GOOS=linux GOARCH=amd64 go build -o main main.go`

## Zip

`zip main.zip main`