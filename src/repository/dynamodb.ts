import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";

const config: DynamoDBClientConfig = {};

if (process.env.STAGE !== 'prod') {
  config.endpoint = 'http://0.0.0.0:8000';
}

const dynamoDbClient = new DynamoDBClient(config);

export default dynamoDbClient;
