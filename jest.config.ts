import { Config } from "jest"

const config: Config = {
  preset: 'ts-jest',
  resetMocks: true,
  testEnvironment: 'node',
  testMatch: ['<rootDir>/test/**/*.test.ts'],
  verbose: true
}

export default config
