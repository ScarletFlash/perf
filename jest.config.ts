/* eslint-disable @typescript-eslint/naming-convention */
import type { Config } from '@jest/types';

const configuration: Config.InitialOptions = {
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.spec.json',
      diagnostics: true
    }
  },
  testEnvironment: 'node',
  automock: false,
  bail: 1,
  cacheDirectory: './.temp/jest-cache',
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['./src/**/*.ts'],
  coverageDirectory: './coverage',
  displayName: 'PERF',
  extensionsToTreatAsEsm: ['.ts'],
  rootDir: './src/',
  moduleNameMapper: {
    '@framework/application': '<rootDir>/framework/application.ts'
  }
};

module.exports = configuration;
