import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts', '!src/index.ts', '!src/bin/mxbai.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^chalk$': '<rootDir>/tests/__mocks__/chalk.ts',
    '^ora$': '<rootDir>/tests/__mocks__/ora.ts',
    '^inquirer$': '<rootDir>/tests/__mocks__/inquirer.ts',
    '^glob$': '<rootDir>/tests/__mocks__/glob.ts',
  },
  testTimeout: 10000,
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(chalk|ora|inquirer|cli-spinners|strip-ansi|ansi-regex|is-unicode-supported)/)',
  ],
};

export default config;
