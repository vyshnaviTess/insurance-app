import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Reminder } from '../domain/entities/insurancePolicy';

const reminders = createEntityAdapter<Reminder>({ sortComparer: (a,b)=>a.dueAt.localeCompare(b.dueAt) });

const slice = createSlice({
  name: 'reminders',
  initialState: reminders.getInitialState(),
  reducers: {
    upsertReminder: reminders.upsertOne,
    removeReminder: reminders.removeOne,
    attachNotificationId(state, action: PayloadAction<{ id: string; notifId: string }>) {
      const r = state.entities[action.payload.id];
      if (r) r.scheduledNotificationId = action.payload.notifId;
    }
  },
});

export const { reducer: remindersReducer, actions: remindersActions } = slice;
export const remindersSelectors = reminders.getSelectors((s:any)=>s.reminders);
