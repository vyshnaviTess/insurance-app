module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  transformIgnorePatterns: [
    "node_modules/(?!(expo|expo-router|expo-linking|expo-asset|expo-file-system|expo-image-picker|expo-constants|expo-modules-core|expo-notifications|expo-application|react-native|react-native-dropdown-picker|react-native-modal-datetime-picker|react-redux|@react-native|@react-navigation|@react-native-async-storage|@reduxjs|immer)/)",
  ],
};
