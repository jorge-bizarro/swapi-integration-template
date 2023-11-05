import { APIGatewayProxyResult } from "aws-lambda";
import { constants } from "node:http2";
import { dynamoDBClient } from "../repository/dynamodb";
import { PersonService } from "../services/personService";

const { HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_OK } = constants;

export const getAllPersonsHandler = async (): Promise<APIGatewayProxyResult> => {
  try {
    const personService = new PersonService(dynamoDBClient);
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
