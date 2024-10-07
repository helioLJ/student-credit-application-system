module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src', '<rootDir>/tests'],
    testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
    transform: {
      '^.+\\.ts$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    setupFilesAfterEnv: ['<rootDir>/src/test-utils/jest-setup.ts'],
    globalSetup: '<rootDir>/src/test-utils/jest-global-setup.ts',
    globalTeardown: '<rootDir>/src/test-utils/jest-global-teardown.ts',
    testTimeout: 30000, // 30 seconds
};