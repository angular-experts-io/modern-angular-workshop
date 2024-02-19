module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts', 'jest-canvas-mock'],
  globalSetup: 'jest-preset-angular/global-setup',
};
