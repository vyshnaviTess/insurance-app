import { AppDispatch } from '../../store';
import { remindersActions } from '../../store/remindersSlice';
import { scheduleLocal } from '../../services/notifications';

export const scheduleReminder = (reminder: { id: string; title: string; dueAt: string; type: 'renewal'|'payment'|'custom' }) =>
  async (dispatch: AppDispatch) => {
    dispatch(remindersActions.upsertReminder({ ...reminder}));
    const notifId = await scheduleLocal(reminder.title, 'Reminder due', new Date(reminder.dueAt));
    dispatch(remindersActions.attachNotificationId({ id: reminder.id, notifId }));
  };
