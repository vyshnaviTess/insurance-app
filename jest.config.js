module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|expo|expo-modules-core|@react-native|@react-navigation|expo-router)/)',
  ],
};
