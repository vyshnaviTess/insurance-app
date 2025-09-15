import "@testing-library/jest-native/extend-expect";
import { __clearOfflineSync } from "./src/store/middleware/offlineSync";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// ✅ Mock Expo Notifications
const mockScheduled: any[] = [
  {
    identifier: "mock-id-1",
    content: { title: "Reminder" },
    trigger: { seconds: 60 },
  },
];

jest.mock("expo-notifications", () => {
  const listeners: Function[] = [];

  return {
    scheduleNotificationAsync: jest.fn().mockImplementation(async (data) => {
      const id = "notif-" + (mockScheduled.length + 1);
      mockScheduled.push({ identifier: id, ...data });
      return id;
    }),
    getPermissionsAsync: jest.fn().mockResolvedValue({ status: "granted" }),
    requestPermissionsAsync: jest.fn().mockResolvedValue({ status: "granted" }),
    setNotificationChannelAsync: jest.fn(),
    setNotificationHandler: jest.fn(),
    cancelScheduledNotificationAsync: jest.fn(),
    getAllScheduledNotificationsAsync: jest.fn().mockImplementation(async () => mockScheduled),
    addNotificationReceivedListener: jest.fn((cb) => {
      listeners.push(cb);
      return { remove: () => listeners.splice(listeners.indexOf(cb), 1) };
    }),
    removeNotificationSubscription: jest.fn(),
    SchedulableTriggerInputTypes: {
      DATE: "date",
      TIME_INTERVAL: "timeInterval",
    },
  };
});

// ✅ Mock expo-image-picker
jest.mock("expo-image-picker", () => ({
  launchCameraAsync: jest.fn().mockResolvedValue({ cancelled: false, uri: "mock-camera.jpg" }),
  launchImageLibraryAsync: jest.fn().mockResolvedValue({ cancelled: false, uri: "mock-gallery.jpg" }),
  requestCameraPermissionsAsync: jest.fn().mockResolvedValue({ status: "granted" }),
  requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValue({ status: "granted" }),
}));

// ✅ Mock expo-file-system
jest.mock("expo-file-system", () => ({
  documentDirectory: "mockDir/",
  copyAsync: jest.fn().mockResolvedValue(undefined),
  readAsStringAsync: jest.fn().mockResolvedValue("mock file content"),
}));

jest.mock("react-native-dropdown-picker", () => {
  return ({ items, value, setValue, placeholder }) => null;
});

// ✅ Mock DateTimePickerModal
jest.mock("react-native-modal-datetime-picker", () => {
  return ({ isVisible, onConfirm, onCancel }) => null;
});

jest.mock("@react-native-community/netinfo", () => {
  return {
    addEventListener: jest.fn(() => jest.fn()), // returns unsubscribe fn
    fetch: jest.fn().mockResolvedValue({
      type: "wifi",
      isConnected: true,
      isInternetReachable: true,
    }),
  };
});

// Mock Expo Router
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() }),
  useLocalSearchParams: () => ({}),
  Link: ({ children }) => children,
}));

// ✅ Global teardown to prevent dangling async handles
afterAll(() => {
  jest.clearAllMocks();
  jest.useRealTimers();
  __clearOfflineSync();
});
afterEach(() => {
  __clearOfflineSync();
});