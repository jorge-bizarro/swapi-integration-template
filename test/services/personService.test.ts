import { DynamoDBClient, ScanCommand, } from "@aws-sdk/client-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { randomUUID } from "node:crypto";
import { PersonService } from "../../src/services/personService";

const ddbMock = mockClient(DynamoDBClient);

describe("Person Service", () => {
  let personService: PersonService;

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

  // it('should create an item', async () => {
  //   const mockSend = jest.fn();
  //   dynamoDBClient.send = mockSend;

  //   const newPerson = structuredClone(person_1);

  //   Reflect.set(newPerson, 'uuid', randomUUID());
  //   Reflect.set(newPerson, 'swapiPersonId', randomUUID());

  //   const expectedPutItemCommand = new PutItemCommand({
  //     TableName: undefined,
  //     Item: marshall(newPerson),
  //   });

  //   await personService.savePerson(newPerson);

  //   expect(mockSend).toHaveBeenCalled();

  //   console.log(expectedPutItemCommand);
  //   console.log(mockSend.mock.calls[0][0]);
  //   console.log('is equaul', expectedPutItemCommand == mockSend.mock.calls[0][0]);

  //   expect(mockSend).toHaveBeenCalledWith(mockSend.mock.calls[0][0]);
  // });

  beforeEach(() => {
    personService = new PersonService(new DynamoDBClient());
    ddbMock.reset();
  });

  it("should return all persons successfully", async () => {
    const person1 = structuredClone(person_1);
    const person2 = structuredClone(person_2);

    Reflect.set(person1, 'uuid', randomUUID());
    Reflect.set(person1, 'swapiPersonId', randomUUID());
    Reflect.set(person2, 'uuid', randomUUID());
    Reflect.set(person2, 'swapiPersonId', randomUUID());

    const scanResponse = {
      Items: [
        person1,
        person2,
      ],
    }

    // DynamoDBClient.send.mockResolvedValue(scanResponse);

    ddbMock.on(ScanCommand)
      .resolves({
        Items: [
          marshall(person_1),
          marshall(person_2)
        ],
    });

    const result = await personService.getAllPersons();

    expect(result).toEqual([person_1, person_2]);
  });

  it("should save a new person successfully", async () => {
    const newPerson = structuredClone(person_1);

    Reflect.set(newPerson, 'uuid', randomUUID());
    Reflect.set(newPerson, 'swapiPersonId', randomUUID());

    ddbMock.on(PutCommand).resolves({});

    await personService.savePerson(newPerson);

    expect(ddbMock.send).toHaveBeenCalled();
  });

});
