import axios from "axios";
import { translateObjectKeys } from "../utils/translate";
import { PersonService } from "./personService";

const { SWAPI_ENDPOINT_URL } = process.env;

export class PersonSWAPIService {
  private personService: PersonService;

  constructor() {
    this.personService = new PersonService();
  }

  async getPersonById(swapiPersonId: string) {
    const [personFound] = await this.personService.getPersonBySwapiId(swapiPersonId);

    if (personFound) {
      return translateObjectKeys(personFound);
    }

    const { data: personSwapi } = await axios.get(`${SWAPI_ENDPOINT_URL}/people/${swapiPersonId}`);
    personSwapi.swapiPersonId = swapiPersonId;

    await this.personService.savePerson(personSwapi);

    return translateObjectKeys(personSwapi);
  }
}
