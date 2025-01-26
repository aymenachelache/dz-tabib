// jest.config.cjs
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest', // Use babel-jest for JS/JSX files
  },
  moduleNameMapper: {
    '^.+\\.(css|scss)$': 'identity-obj-proxy', // Mock CSS/SCSS files
    '^.+\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/__mocks__/fileMock.js', // Mock image files
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Include the setup file
  globals: {
    'process.env': {
      VITE_API_URL: 'http://127.0.0.1:8000', // Mock environment variable
    },
  },
};