import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { constants } from "node:http2";
import { PersonService } from "../services/person";

const { HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_CREATED } = constants;

export async function savePersonHandler(event: APIGatewayProxyEvent, context: Context) {
  try {
    const personService = new PersonService();
    const result = personService.savePerson(event.body);

    return {
      statusCode: HTTP_STATUS_CREATED,
      body: JSON.stringify({
        status: 'success',
        data: result,
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
