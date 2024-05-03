/** @type {import('jest').Config} */
const config = {
  clearMocks: true,
  collectCoverage: true,
  setupFilesAfterEnv: ['./jest.setup.js'],
  moduleNameMapper: { '\\.(css|less|scss|sass)$': 'identity-obj-proxy' },
  transform: { '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { configFile: "./babel.config.js" }] },
  coverageDirectory: "coverage",
  testEnvironment: "jest-environment-jsdom",
  verbose: true,
  };
  module.exports = config;