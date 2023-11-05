import { PutItemCommand, QueryCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { randomUUID } from "node:crypto";
import { dynamoDbClient } from "../repository/dynamodb";
import { translateObjectKeys } from "../utils/translate";

const { PERSONS_TABLE_NAME, SWAPI_PERSON_ID_GSI_NAME } = process.env;

export class PersonService {
  constructor() {
  }

  async getAllPersons() {
    try {
      const command = new ScanCommand({
        TableName: PERSONS_TABLE_NAME
      });
      const result = await dynamoDbClient.send(command);
      return result.Items?.map(item => unmarshall(item)).map(item => translateObjectKeys(item))  || [];
    } catch (error) {
      console.log('error ->', error);
      throw new Error('Error getting persons')
    }
  }

  async savePerson(newPerson: any): Promise<void> {
    newPerson.uuid = randomUUID();
    newPerson.swapiPersonId ??= randomUUID();

    await dynamoDbClient.send(new PutItemCommand({
      TableName: PERSONS_TABLE_NAME,
      Item: marshall(newPerson || {})
    }));
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
