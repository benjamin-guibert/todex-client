module.exports = {
  roots: ['src'],
  moduleFileExtensions: ['ts', 'js', 'tsx', 'jsx', 'json', 'node'],
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'src/__mocks__/file.ts',
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(\\.|/)test\\.(j|t)sx?$',
  setupFilesAfterEnv: ['<rootDir>/src/tests/jest.setup.ts'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js{,x},ts{,x}}', '!src/**/*.stories.{js{,x},ts{,x}}', '!src/index.tsx'],
}
