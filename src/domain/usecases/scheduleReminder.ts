import { AppDispatch } from '../../store';
import { remindersActions } from '../../store/remindersSlice';
import { scheduleLocal } from '../../services/notifications';

export const scheduleReminder = (reminder: { id: string; title: string; dueAt: string }) =>
  async (dispatch: AppDispatch) => {
    dispatch(remindersActions.upsertReminder({ ...reminder, type: 'custom' }));
    const notifId = await scheduleLocal(reminder.title, 'Reminder due', new Date(reminder.dueAt));
    dispatch(remindersActions.attachNotificationId({ id: reminder.id, notifId }));
  };
