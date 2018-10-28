package main

import (
	"context"
	"encoding/json"
	"errors"
	"log"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/gocolly/colly"
)

type RequestBody struct {
	Name string `json:"name"`
}

type ResponseBody struct {
	Result string `json:"result"`
}

func fetchResult(name string) (string, error) {
	var result string
	var err error

	isElementFound := false

	collector := colly.NewCollector()
	// Child div of the div with "result2" class contains the result text
	collector.OnHTML(".result2", func(result2 *colly.HTMLElement) {
		result = result2.ChildText("div")
		isElementFound = true
	})
	// Executed after OnHTML
	collector.OnScraped(func(r *colly.Response) {
		if !isElementFound {
			err = errors.New("Cannot find the specified HTML element")
		}
	})
	collector.OnError(func(r *colly.Response, collectorErr error) {
		err = collectorErr
	})
	collector.Post(
		os.Getenv("SHINDAN_ROOT_URL") + os.Getenv("SEYAKATE_SHINDAN_ID"),
		map[string]string{"u": name, "from": ""},
	)
	return result, err
}

func handleRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	log.Print(request)

	responseHeaders := map[string]string{
		"Access-Control-Allow-Origin":  os.Getenv("ACCESS_CONTROL_ALLOW_ORIGIN"),
		"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
		"Content-Type": "application/json; charset=utf-8",
	}

	if request.HTTPMethod == "OPTIONS" {
		return events.APIGatewayProxyResponse{
			Headers:    responseHeaders,
			StatusCode: 200,
		}, nil
	}

	// Parse the request
	requestBody := RequestBody{}
	json.Unmarshal([]byte(request.Body), &requestBody)
	
	// Get the result
	name := requestBody.Name
	log.Print("Name:", name)
	result, err := fetchResult(name)
	if err == nil {
		log.Print("Result:", result)
	} else {
		log.Print("Error:", err)
	}

	responseBody, _ := json.Marshal(ResponseBody{Result: result})

	if err == nil {
		return events.APIGatewayProxyResponse{
			Headers:    responseHeaders,
			Body:       string(responseBody),
			StatusCode: 200,
		}, nil
	} else {
		return events.APIGatewayProxyResponse{
			Headers:    responseHeaders,
			StatusCode: 500,
		}, nil
	}
}

func main() {
	lambda.Start(handleRequest)
}
