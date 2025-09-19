import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';

export type OfflineJob = {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  entity: 'policy' | 'document';
  payload: any;
};

const slice = createSlice({
  name: 'offlineQueue',
  initialState: [] as OfflineJob[],
  reducers: {
    enqueue(state, action: PayloadAction<Omit<OfflineJob, 'id'>>) {
      state.push({ id: nanoid(), ...action.payload });
    },
    dequeue(state, action: PayloadAction<string>) {
      return state.filter(j => j.id !== action.payload);
    },
    clear() { return []; },
  },
});

export const { enqueue, dequeue, clear } = slice.actions;
export const offlineQueueReducer = slice.reducer;
