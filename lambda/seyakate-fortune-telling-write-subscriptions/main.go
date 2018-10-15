package main

import (
	"context"
	"encoding/json"
	"log"

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

func connectToDb() *dynamodb.DynamoDB {
	sess, err := session.NewSession(&aws.Config{
		Region: aws.String("ap-northeast-1"),
	})
	if err != nil {
		log.Print("Failed to connect to the DB")
		panic(err)
	}
	return dynamodb.New(sess)
}

func createSubscription(db *dynamodb.DynamoDB, subscription Subscription) string {
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
		return ""
	}

	params := &dynamodb.PutItemInput{
		TableName: aws.String("seyakate-fortune-telling-subscriptions"),
		Item:      attributeValue,
	}

	_, err = db.PutItem(params)

	if err == nil {
		return uuid
	} else {
		log.Print("Error putting a subscription item")
		log.Print(err)
		return ""
	}
}

func deleteSubscription(db *dynamodb.DynamoDB, subscriptionId string) string {
	params := &dynamodb.DeleteItemInput{
		TableName: aws.String("seyakate-fortune-telling-subscriptions"),
		Key: map[string]*dynamodb.AttributeValue{
			"id": {
				S: aws.String(subscriptionId),
			},
		},
	}

	_, err := db.DeleteItem(params)

	if err == nil {
		return subscriptionId
	} else {
		log.Print("Failed to delete a subscription")
		log.Print(err)
		return ""
	}
}

func handleRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	log.Print(request.Body)

	// Parse the request
	requestBody := RequestBody{}
	json.Unmarshal([]byte(request.Body), &requestBody)

	// Execute the specified operation
	responseBody := ""
	db := connectToDb()
	if requestBody.Operation == "create" {
		responseBody = createSubscription(db, requestBody.Subscription)
	}
	if requestBody.Operation == "delete" {
		responseBody = deleteSubscription(db, requestBody.SubscriptionId)
	}

	return events.APIGatewayProxyResponse{
		Body:       responseBody,
		StatusCode: 200,
	}, nil
}

func main() {
	lambda.Start(handleRequest)
}
