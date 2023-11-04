import axios from "axios";
import { PersonService } from "./personService";


export class PersonSWAPIService {
  private personService: PersonService;

  constructor() {
    this.personService = new PersonService();
  }

  async getPersonById(swapiPersonId: string) {
    const [personFound] = await this.personService.getPersonBySwapiId(swapiPersonId);

    if (personFound) {
      return personFound;
    }

    const { data: personSwapi } = await axios.get(`https://swapi.dev/api/people/${swapiPersonId}`);
    personSwapi.swapiPersonId = swapiPersonId;

    await this.personService.savePerson(personSwapi);

    return personSwapi;
  }
}
