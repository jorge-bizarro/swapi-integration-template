import fs from 'node:fs/promises';
import path from 'node:path';

export async function healthCheckHandler() {
  try {
    const content = await fs.readFile(path.join(process.cwd(), 'package.json'), 'utf8');
    const packageJson = JSON.parse(content);

    return {
      statusCode: 200,
      body: JSON.stringify({
        status: 'healthy',
        version: packageJson.version
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
