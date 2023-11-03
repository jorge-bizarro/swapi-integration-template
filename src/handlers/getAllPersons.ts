import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { PersonService } from "../services/person";

export const getAllPersonsHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const personService = new PersonService();
    const persons = await personService.getAllPersons();

    return {
      statusCode: 200,
      body: JSON.stringify({
        status: 'success',
        data: persons,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        status: 'error',
        error: `${error}`,
      })
    }
  }
}
