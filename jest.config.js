module.exports = {
    preset: 'ts-jest',
    transform: {
        '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
    },
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    moduleNameMapper: {'^@/(.*)$': '<rootDir>/src/$1','^next/navigation$': '<rootDir>/__mocks__/next/navigation.js',},
    setupFiles: ['<rootDir>/jest.setup.js'],
};
