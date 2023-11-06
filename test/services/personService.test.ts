import { DynamoDBClient, PutItemCommand, QueryCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { AwsClientStub, mockClient } from "aws-sdk-client-mock";
import 'aws-sdk-client-mock-jest';
import { randomUUID } from "node:crypto";
import { PersonService } from "../../src/services/personService";

function createPersonWithId<T extends Record<string, any>>(personBase: T): T & { uuid: string, swapiPersonId: string } {
  const person = structuredClone(personBase);
  const personUuid = randomUUID();
  const swapiPersonId = randomUUID();

  Reflect.set(person, 'uuid', personUuid);
  Reflect.set(person, 'swapiPersonId', swapiPersonId);

  return person as T & { uuid: string, swapiPersonId: string };
}

describe('Person service', () => {

  const dynamoDBMock: AwsClientStub<DynamoDBClient> = mockClient(DynamoDBClient);
  const dynamoDBClient: DynamoDBClient = new DynamoDBClient({});
  const personService: PersonService = new PersonService(dynamoDBClient);

  const person_1 = {
    "nombre": "Luke Skywalker",
    "talla": "172",
    "peso": "77",
    "color_cabello": "blond",
    "color_piel": "fair",
    "color_ojo": "blue",
    "fecha_nacimiento": "19BBY",
    "genero": "male",
    "planeta_origen": "https://swapi.dev/api/planets/1/",
    "peliculas": [
        "https://swapi.dev/api/films/1/",
        "https://swapi.dev/api/films/2/",
        "https://swapi.dev/api/films/3/",
        "https://swapi.dev/api/films/6/"
    ],
    "especies": [],
    "vehiculos": [
        "https://swapi.dev/api/vehicles/14/",
        "https://swapi.dev/api/vehicles/30/"
    ],
    "naves": [
        "https://swapi.dev/api/starships/12/",
        "https://swapi.dev/api/starships/22/"
    ],
    "fecha_creacion": "2014-12-09T13:50:51.644000Z",
    "fecha_edicion": "2014-12-20T21:17:56.891000Z",
    "url": "https://swapi.dev/api/people/1/",
  }

  const person_2 = {
    "nombre": "C-3PO",
    "talla": "167",
    "peso": "75",
    "color_cabello": "n/a",
    "color_piel": "gold",
    "color_ojo": "yellow",
    "fecha_nacimiento": "112BBY",
    "genero": "n/a",
    "planeta_origen": "https://swapi.dev/api/planets/1/",
    "peliculas": [
        "https://swapi.dev/api/films/1/",
        "https://swapi.dev/api/films/2/",
        "https://swapi.dev/api/films/3/",
        "https://swapi.dev/api/films/4/",
        "https://swapi.dev/api/films/5/",
        "https://swapi.dev/api/films/6/"
    ],
    "especies": [
        "https://swapi.dev/api/species/2/"
    ],
    "vehiculos": [],
    "naves": [],
    "fecha_creacion": "2014-12-10T15:10:51.357000Z",
    "fecha_edicion": "2014-12-20T21:17:50.309000Z",
    "url": "https://swapi.dev/api/people/2/",
  }

  beforeEach(() => {
    dynamoDBMock.reset();
  })

  it('should retrieve all persons from the database', async () => {
    dynamoDBMock.on(ScanCommand).resolves({
      Items: [
        marshall(person_1),
        marshall(person_2)
      ]
    });

    const result = await personService.getAllPersons();

    expect(dynamoDBMock).toHaveReceivedCommandTimes(ScanCommand, 1);
    expect(result).toEqual([
      person_1,
      person_2
    ]);
  })

  it('should save a new person to the database', async () => {
    dynamoDBMock.on(PutItemCommand).resolves({});

    await personService.savePerson(person_1);

    expect(dynamoDBMock).toHaveReceivedCommandTimes(PutItemCommand, 1);
  })

  it('should return an empty array when no person with the given swapiPersonId is found', async () => {
    dynamoDBMock.on(QueryCommand).resolves({
      Items: []
    });

    const swapiPersonId = randomUUID();
    const result = await personService.getPersonBySwapiId(swapiPersonId);

    expect(dynamoDBMock).toHaveReceivedCommandTimes(QueryCommand, 1);
    expect(result).toEqual([]);
  })

  it('should return an array with one item when one person with the given swapiPersonId is found', async () => {
    const person = createPersonWithId(person_1);

    dynamoDBMock.on(QueryCommand).resolves({
      Items: [
        marshall(person),
      ]
    });

    const result = await personService.getPersonBySwapiId(person.swapiPersonId);

    expect(dynamoDBMock).toHaveReceivedCommandTimes(QueryCommand, 1);
    expect(result).toEqual([
      person
    ]);
  });

  it('should return an array with multiple items when multiple persons with the given swapiPersonId are found', async () => {
    const fakePerson1 = createPersonWithId(person_1);
    const fakePerson2 = createPersonWithId(person_2);

    fakePerson1.swapiPersonId = randomUUID();
    fakePerson2.swapiPersonId = randomUUID();

    dynamoDBMock.on(QueryCommand).resolves({
      Items: [
        marshall(fakePerson1),
        marshall(fakePerson2)
      ]
    });

    const result = await personService.getPersonBySwapiId(fakePerson1.swapiPersonId);

    expect(dynamoDBMock).toHaveReceivedCommandTimes(QueryCommand, 1);
    expect(result).toEqual([
      fakePerson1,
      fakePerson2
    ]);
  });

  it('should throw an error when the swapiPersonId parameter is not provided', async () => {
    await expect(personService.getPersonBySwapiId(undefined as unknown as string)).rejects.toThrow();
  });

})
