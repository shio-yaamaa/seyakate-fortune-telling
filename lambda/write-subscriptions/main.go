package main

import (
	"context"
	"encoding/json"
	"log"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	"github.com/google/uuid"
)

type Keys struct {
	P256dh string `json:"p256dh"`
	Auth   string `json:"auth"`
}

type Subscription struct {
	Endpoint string `json:"endpoint"`
	Keys     Keys   `json:"keys"`
}

type StorableSubscription struct {
	Id       string `json:"id"`
	Endpoint string `json:"endpoint"`
	Keys     Keys   `json:"keys"`
}

type RequestBody struct {
	Operation      string       `json:"operation"`      // "create" or "delete"
	Subscription   Subscription `json:"subscription"`   // Needed when "create"
	SubscriptionId string       `json:"subscriptionId"` // Needed when "delete"
}

type ResponseBody struct {
	SubscriptionId string `json:"subscriptionId"`
	IsError        bool   `json:"isError"`
}

func connectToDb() *dynamodb.DynamoDB {
	sess, err := session.NewSession(&aws.Config{
		Region: aws.String(os.Getenv("DYNAMODB_REGION")),
	})
	if err != nil {
		log.Print("Failed to connect to the DB")
		panic(err)
	}
	return dynamodb.New(sess)
}

func createSubscription(db *dynamodb.DynamoDB, subscription Subscription) (string, error) {
	// Attach a UUID to the subscription
	uuid := uuid.NewSHA1(uuid.Nil, []byte(subscription.Endpoint)).String()
	storableSubscription := StorableSubscription{
		Id:       uuid,
		Endpoint: subscription.Endpoint,
		Keys:     subscription.Keys,
	}

	attributeValue, err := dynamodbattribute.MarshalMap(storableSubscription)
	if err != nil {
		log.Print("Failed to create an AttributeValue")
		log.Print(err)
		return "", err
	}

	params := &dynamodb.PutItemInput{
		TableName: aws.String(os.Getenv("SUBSCRIPTION_TABLE_NAME")),
		Item:      attributeValue,
	}

	_, err = db.PutItem(params)

	if err == nil {
		return uuid, nil
	} else {
		log.Print("Error putting a subscription item")
		log.Print(err)
		return "", err
	}
}

func deleteSubscription(db *dynamodb.DynamoDB, subscriptionId string) (string, error) {
	params := &dynamodb.DeleteItemInput{
		TableName: aws.String(os.Getenv("SUBSCRIPTION_TABLE_NAME")),
		Key: map[string]*dynamodb.AttributeValue{
			"id": {
				S: aws.String(subscriptionId),
			},
		},
	}

	_, err := db.DeleteItem(params)

	if err == nil {
		return subscriptionId, nil
	} else {
		log.Print("Failed to delete a subscription")
		log.Print(err)
		return "", err
	}
}

func handleRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	log.Print(request.Body)

	// Parse the request
	requestBody := RequestBody{}
	json.Unmarshal([]byte(request.Body), &requestBody)

	// Execute the specified operation
	subscriptionId := ""
	isError := true
	db := connectToDb()
	if requestBody.Operation == "create" {
		id, err := createSubscription(db, requestBody.Subscription)
		subscriptionId, isError = id, err != nil
	}
	if requestBody.Operation == "delete" {
		id, err := deleteSubscription(db, requestBody.SubscriptionId)
		subscriptionId, isError = id, err != nil
	}

	responseBody, _ := json.Marshal(ResponseBody{SubscriptionId: subscriptionId, IsError: isError})

	return events.APIGatewayProxyResponse{
		Headers:    map[string]string{
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    		"Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
		},
		Body:       string(responseBody),
		StatusCode: 200,
	}, nil
}

func main() {
	lambda.Start(handleRequest)
}
