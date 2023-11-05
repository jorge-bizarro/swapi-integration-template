import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { constants } from "node:http2";
import { PersonService } from "../services/personService";

const { HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_CREATED } = constants;

export const savePersonHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const personService = new PersonService();
    const newPerson = JSON.parse(event.body as string);
    await personService.savePerson(newPerson);

    return {
      statusCode: HTTP_STATUS_CREATED,
      body: JSON.stringify({
        status: 'success',
      }),
    };
  } catch (error) {
    return {
      statusCode: HTTP_STATUS_INTERNAL_SERVER_ERROR,
      body: JSON.stringify({
        status: 'error',
        error: `${error}`,
      })
    }
  }
}
