import { DynamoDBClient, PutItemCommand, QueryCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { randomUUID } from "node:crypto";
import { translateObjectKeys } from "../utils/translate";
import { SwapiService } from "./swapiService";

const { PERSONS_TABLE_NAME, SWAPI_PERSON_ID_GSI_NAME } = process.env;

export class PersonService {

  private readonly dynamoDBClient: DynamoDBClient;
  private readonly swapiService: SwapiService;

  constructor(dynamoDBClient: DynamoDBClient, swapiService: SwapiService) {
    this.dynamoDBClient = dynamoDBClient;
    this.swapiService = swapiService;
  }

  async getAllPersons() {
    const command = new ScanCommand({
      TableName: PERSONS_TABLE_NAME
    });
    const result = await this.dynamoDBClient.send(command);
    return result.Items?.map(item => unmarshall(item)).map(item => translateObjectKeys(item))  || [];
  }

  async savePerson(newPerson: any): Promise<void> {
    newPerson.uuid = randomUUID();
    newPerson.swapiPersonId ??= randomUUID();

    await this.dynamoDBClient.send(new PutItemCommand({
      TableName: PERSONS_TABLE_NAME,
      Item: marshall(newPerson)
    }));
  }

  private async getPersonsBySwapiIdFromDatabase(swapiPersonId: string): Promise<any[]> {
    const result = await this.dynamoDBClient.send(new QueryCommand({
      TableName: PERSONS_TABLE_NAME,
      IndexName: SWAPI_PERSON_ID_GSI_NAME,
      KeyConditionExpression: "swapiPersonId = :swapiPersonId",
      ExpressionAttributeValues: marshall({ ':swapiPersonId': swapiPersonId })
    }));

    return result.Items?.map(item => unmarshall(item)) || [];
  }

  async getOnePersonBySwapiId(swapiPersonId: string) {
    const [personFound] = await this.getPersonsBySwapiIdFromDatabase(swapiPersonId);

    if (personFound) {
      return translateObjectKeys(personFound);
    }

    const swapiPerson = await this.swapiService.getPersonBySwapiId(swapiPersonId);

    Reflect.set(swapiPerson, 'swapiPersonId', swapiPersonId);

    await this.savePerson(structuredClone(swapiPerson));

    return translateObjectKeys(swapiPerson);
  }
}
