import { AppDispatch } from "../../store";
import { remindersActions } from "../../store/remindersSlice";
import { scheduleLocal } from "../../services/notifications";
import { Result, Ok, Err } from "@/utils/result";

export const scheduleReminder =
  (reminder: { id: string; title: string; dueAt: string; type: 'renewal'|'payment'|'custom' }) =>
  async (dispatch: AppDispatch): Promise<Result<void, Error>> => {
    try {
      dispatch(remindersActions.upsertReminder({ ...reminder }));
      const notifId = await scheduleLocal(reminder.title, "Reminder due", new Date(reminder.dueAt));
      dispatch(remindersActions.attachNotificationId({ id: reminder.id, notifId }));
      return Ok(undefined);
    } catch (err: any) {
      return Err(err instanceof Error ? err : new Error("Notification scheduling failed"));
    }
  };
