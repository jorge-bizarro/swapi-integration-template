import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { constants } from "node:http2";
import { PersonService } from "../services/person";

const { HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_OK } = constants;

export const getAllPersonsHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const personService = new PersonService();
    const persons = await personService.getAllPersons();

    return {
      statusCode: HTTP_STATUS_OK,
      body: JSON.stringify({
        status: 'success',
        data: persons,
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
