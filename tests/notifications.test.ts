import * as Notifications from 'expo-notifications';
import { scheduleLocal } from '../src/services/notifications';

jest.mock('expo-notifications');

test('schedules a notification', async () => {
  (Notifications.getPermissionsAsync as any).mockResolvedValue({ status: 'granted' });
  (Notifications.scheduleNotificationAsync as any).mockResolvedValue('notif-1');
  const id = await scheduleLocal('Title', 'Body', new Date('2030-01-01'));
  expect(id).toBe('notif-1');
});
