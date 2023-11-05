import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";

const config: DynamoDBClientConfig = {};

if (process.env.STAGE !== 'prod') {
  config.endpoint = 'http://127.0.0.1:8000';
}

export const dynamoDbClient = new DynamoDBClient(config);
