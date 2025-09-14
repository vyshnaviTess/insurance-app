import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

/**
 * Ensure the app has permissions for notifications
 */
export async function ensurePermissions() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    throw new Error("Notifications permission denied");
  }

  // Android: setup notification channel
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default",
      importance: Notifications.AndroidImportance.HIGH,
      sound: "default", // ✅ must be string or null
    });
  }
}

export async function scheduleLocal(title: string, body: string, date: Date) {
  await ensurePermissions();

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: "default",
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: date, },
  });

  // 🔍 Debug logs
  console.log("Scheduled notification with ID:", id);

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  console.log("All scheduled notifications:", JSON.stringify(scheduled, null, 2));

  return id;
}

/**
 * Cancel a scheduled notification by ID
 */
export async function cancel(id: string) {
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch (err) {
    console.warn("Failed to cancel notification:", err);
  }
}
