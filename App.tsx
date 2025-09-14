// Load gesture-handler first (safe no-op on web, required on native)
import 'react-native-gesture-handler';
import * as Notifications from "expo-notifications";

// Configure foreground behavior only for local notifications
// Configure foreground behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true, 
    shouldShowList: true,  
  }),
});

// Hand off control to Expo Router
export { default } from 'expo-router/entry';
