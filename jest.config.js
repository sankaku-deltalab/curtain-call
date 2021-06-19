module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFiles: ['jest-canvas-mock'],
  testMatch: ['**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)'],
  collectCoverageFrom: ['packages/**/src/**/*.ts'],
};
