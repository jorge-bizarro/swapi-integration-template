import axios from "axios";
import { SwapiService } from "../../src/services/swapiService";

const swapiService: SwapiService = new SwapiService();

describe('SWAPI Service', () => {

  it('should return the correct person data when given a valid swapiPersonId', async () => {
    const swapiPersonId = '1';

    const response = {
      data: {
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
    };

    jest.spyOn(axios, 'get').mockResolvedValueOnce(response);

    const result = await swapiService.getPersonBySwapiId(swapiPersonId);

    expect(result).toEqual(response.data);
    expect(axios.get).toHaveBeenCalledWith(`${process.env.SWAPI_ENDPOINT_URL}/people/${swapiPersonId}`);
  });

  it('should handle and return a not found object when given a non-existent swapiPersonId', async () => {
    const swapiPersonId = '1000';

    const response = {
      data: {
        detail: "Not found"
      }
    };

    jest.spyOn(axios, 'get').mockResolvedValueOnce(response);

    const result = await swapiService.getPersonBySwapiId(swapiPersonId);

    expect(result).toEqual(response.data);
    expect(axios.get).toHaveBeenCalledWith(`${process.env.SWAPI_ENDPOINT_URL}/people/${swapiPersonId}`);
  });

})
