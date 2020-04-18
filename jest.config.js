module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFiles: ["jest-canvas-mock"],
  collectCoverageFrom: ["packages/**/src/**/*.ts"]
};