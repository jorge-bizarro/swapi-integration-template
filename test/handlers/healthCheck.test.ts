import fs from "node:fs/promises";
import path from "node:path";
import { healthCheckHandler } from "../../src/handlers/healthCheck";

describe('HealthCheck handler', () => {
  it('Should return an object of a success response with the version of the package', async () => {
    const content = await fs.readFile(path.join(process.cwd(), 'package.json'), 'utf8');
    const packageJson = JSON.parse(content);
    const response = await healthCheckHandler();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(JSON.stringify({
      status: 'healthy',
      data: packageJson.version,
    }));
  });
});

