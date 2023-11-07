import axios from "axios";

const { SWAPI_ENDPOINT_URL } = process.env;

export class SwapiService {

  async getPersonBySwapiId(swapiPersonId: string): Promise<any> {
    const response = await axios.get(`${SWAPI_ENDPOINT_URL}/people/${swapiPersonId}`);

    return response.data;
  }

}
