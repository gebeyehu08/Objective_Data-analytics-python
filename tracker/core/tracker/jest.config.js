/*
 * Copyright 2022 Objectiv B.V.
 */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  reporters: ['jest-standard-reporter'],
  collectCoverageFrom: ['src/**.ts'],
  moduleNameMapper: {
    '@objectiv/schema': '<rootDir>../../core/schema/src',
    '@objectiv/testing-tools': '<rootDir>../../core/testing-tools/src',
  },
};
