import { DynamoDBClient, PutItemCommand, QueryCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { AwsClientStub, mockClient } from "aws-sdk-client-mock";
import 'aws-sdk-client-mock-jest';
import axios from "axios";
import { PersonService } from "../../src/services/personService";
import { SwapiService } from "../../src/services/swapiService";
import { translateObjectKeys } from "../../src/utils/translate";

const RANDOM_UUID = '1111-1111-1111-1111';
let dynamoDBMock: AwsClientStub<DynamoDBClient>;
let personService: PersonService;

jest.mock('node:crypto', () => ({
  randomUUID: () => RANDOM_UUID
}));

const personLuke = {
  name: 'Luke Skywalker',
  height: '172',
  mass: '77',
  hair_color: 'blond',
  skin_color: 'fair',
  eye_color: 'blue',
  birth_year: '19BBY',
  gender: 'male',
  homeworld: 'https://swapi.dev/api/planets/1/',
  films: [
    'https://swapi.dev/api/films/1/',
    'https://swapi.dev/api/films/2/',
    'https://swapi.dev/api/films/3/',
    'https://swapi.dev/api/films/6/'
  ],
  species: [],
  vehicles: [
    'https://swapi.dev/api/vehicles/14/',
    'https://swapi.dev/api/vehicles/30/'
  ],
  starships: [
    'https://swapi.dev/api/starships/12/',
    'https://swapi.dev/api/starships/22/'
  ],
  created: '2014-12-09T13:50:51.644000Z',
  edited: '2014-12-20T21:17:56.891000Z',
  url: 'https://swapi.dev/api/people/1/'
}

describe('Person service', () => {

  beforeAll(() => {
    const dynamoDBClient: DynamoDBClient = new DynamoDBClient();
    const swapiService: SwapiService = new SwapiService();

    personService = new PersonService(dynamoDBClient, swapiService);
    dynamoDBMock = mockClient(DynamoDBClient);
  })

  beforeEach(() => {
    dynamoDBMock.reset();
  })

  it('should return all persons from database when getAllPersons is called', async () => {
    const mockItems = [structuredClone(personLuke)];

    dynamoDBMock.on(ScanCommand).resolves({
      Items: mockItems.map(item => marshall(item))
    });

    const result = await personService.getAllPersons();

    expect(dynamoDBMock).toHaveReceivedCommand(ScanCommand);
    expect(dynamoDBMock).toHaveReceivedCommandTimes(ScanCommand, 1);
    expect(dynamoDBMock).toHaveReceivedCommandWith(ScanCommand, {
      TableName: process.env.PERSONS_TABLE_NAME
    });
    expect(result).toEqual(mockItems.map(item => translateObjectKeys(item)));
  });

  it('should save a new person to the database when savePerson is called', async () => {
    const personToSave = structuredClone(personLuke);

    dynamoDBMock.on(PutItemCommand).resolves({});

    const result = await personService.savePerson(personToSave);

    expect(dynamoDBMock).toHaveReceivedCommand(PutItemCommand);
    expect(dynamoDBMock).toHaveReceivedCommandTimes(PutItemCommand, 1);
    expect(dynamoDBMock).toHaveReceivedCommandWith(PutItemCommand, {
      TableName: process.env.PERSONS_TABLE_NAME,
      Item: marshall(personToSave),
    });
    expect(result).toEqual(undefined);
  })

  it('should create a person in the database when does not exist', async () => {
    const swapiPersonId = '10'

    dynamoDBMock.on(QueryCommand).resolves({
      Items: []
    })

    dynamoDBMock.on(PutItemCommand).resolves({});

    jest.spyOn(axios, 'get').mockResolvedValueOnce({
      data: structuredClone(personLuke),
    });

    const result = await personService.getOnePersonBySwapiId(swapiPersonId);

    expect(dynamoDBMock).toHaveReceivedCommand(QueryCommand);
    expect(dynamoDBMock).toHaveReceivedCommandTimes(QueryCommand, 1);
    expect(dynamoDBMock).toHaveReceivedCommandWith(QueryCommand, {
      TableName: process.env.PERSONS_TABLE_NAME,
      IndexName: process.env.SWAPI_PERSON_ID_GSI_NAME,
      KeyConditionExpression: "swapiPersonId = :swapiPersonId",
      ExpressionAttributeValues: marshall({ ':swapiPersonId': swapiPersonId })
    });
    expect(dynamoDBMock).toHaveReceivedCommand(PutItemCommand);
    expect(dynamoDBMock).toHaveReceivedCommandTimes(PutItemCommand, 1);
    expect(dynamoDBMock).toHaveReceivedCommandWith(PutItemCommand, {
      TableName: process.env.PERSONS_TABLE_NAME,
      Item: marshall({
        ...personLuke,
        uuid: RANDOM_UUID,
        swapiPersonId,
      }),
    });
    expect(result).toEqual(translateObjectKeys({
      ...personLuke,
      swapiPersonId
    }));
  })

  it('should return person from database if exists', async () => {
    const swapiPersonId = '10'

    dynamoDBMock.on(QueryCommand).resolves({
      Items: [
        marshall({
          ...personLuke,
          uuid: RANDOM_UUID,
          swapiPersonId
        })
      ]
    })

    const result = await personService.getOnePersonBySwapiId(swapiPersonId);

    expect(dynamoDBMock).toHaveReceivedCommandTimes(QueryCommand, 1);
    expect(dynamoDBMock).toHaveReceivedCommandWith(QueryCommand, {
      TableName: process.env.PERSONS_TABLE_NAME,
      IndexName: process.env.SWAPI_PERSON_ID_GSI_NAME,
      KeyConditionExpression: "swapiPersonId = :swapiPersonId",
      ExpressionAttributeValues: marshall({ ':swapiPersonId': swapiPersonId })
    });
    expect(dynamoDBMock).toHaveReceivedCommandTimes(PutItemCommand, 0);
    expect(result).toEqual(translateObjectKeys({
      ...personLuke,
      uuid: RANDOM_UUID,
      swapiPersonId
    }));
  });

})
