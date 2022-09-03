module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  globalSetup: './global.setup.js',
  testMatch: [
    '**/__tests__/**/*.test.js'
  ]
}
