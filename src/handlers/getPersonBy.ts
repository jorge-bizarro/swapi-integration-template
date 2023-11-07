import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { constants } from "node:http2";
import { dynamoDBClient } from "../repository/dynamodb";
import { PersonService } from "../services/personService";
import { SwapiService } from "../services/swapiService";

const { HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_OK, HTTP_STATUS_BAD_REQUEST } = constants;

export const getOnePersonBySwapiIdHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const swapiPersonId = event.pathParameters?.id;

    if (!swapiPersonId) {
      return {
        statusCode: HTTP_STATUS_BAD_REQUEST,
        body: JSON.stringify({
          status: 'Bad Request',
          error: "Missing id parameter"
        })
      };
    }

    const personService = new PersonService(dynamoDBClient, new SwapiService());
    const persons = await personService.getOnePersonBySwapiId(swapiPersonId);

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
