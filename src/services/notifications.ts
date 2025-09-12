import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function ensurePermissions() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    const { status: s2 } = await Notifications.requestPermissionsAsync();
    if (s2 !== 'granted') throw new Error('Notifications permission denied');
  }
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', { name: 'Default', importance: Notifications.AndroidImportance.DEFAULT });
  }
}

export async function scheduleLocal(title: string, body: string, date: Date) {
  await ensurePermissions();
  return Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: {
     type: Notifications.SchedulableTriggerInputTypes.DATE,
     date: date,
     },
  });
}

export async function cancel(id: string) {
  try { await Notifications.cancelScheduledNotificationAsync(id); } catch {}
}
