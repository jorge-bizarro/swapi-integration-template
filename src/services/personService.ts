import { PutItemCommand, QueryCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { randomUUID } from "node:crypto";
import dynamoDbClient from "../repository/dynamodb";

const { PERSONS_TABLE_NAME, SWAPI_PERSON_ID_GSI_NAME } = process.env;

export class PersonService {
  constructor() {
  }

  async getAllPersons() {
    const result = await dynamoDbClient.send(new ScanCommand({
      TableName: PERSONS_TABLE_NAME,
    }));

    return result.Items?.map(item => unmarshall(item)) || [];
  }

  async savePerson(newPerson: any) {
    newPerson.uuid = randomUUID();
    newPerson.swapiPersonId ??= randomUUID();

    const result = await dynamoDbClient.send(new PutItemCommand({
      TableName: PERSONS_TABLE_NAME,
      Item: marshall(newPerson || {})
    }));

    return result;
  }

  async getPersonBySwapiId(swapiPersonId: string) {
    const result = await dynamoDbClient.send(new QueryCommand({
      TableName: PERSONS_TABLE_NAME,
      IndexName: SWAPI_PERSON_ID_GSI_NAME,
      KeyConditionExpression: "swapiPersonId = :swapiPersonId",
      ExpressionAttributeValues: marshall({ ':swapiPersonId': swapiPersonId })
    }));

    return result.Items?.map(item => unmarshall(item)) || [];
  }
}
