import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { constants } from "node:http2";
import { PersonSWAPIService } from "../services/personSwapiService";

const { HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_OK, HTTP_STATUS_BAD_REQUEST } = constants;

export const getPersonByIdFromSwapiHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const personId = event.pathParameters?.id;

    if (!personId) {
      return {
        statusCode: HTTP_STATUS_BAD_REQUEST,
        body: JSON.stringify({
          status: 'Bad Request',
          error: "Missing id parameter"
        })
      };
    }

    const personService = new PersonSWAPIService();
    const persons = await personService.getPersonById(personId);

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
