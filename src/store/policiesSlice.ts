import { createSlice, createEntityAdapter, createSelector, PayloadAction } from '@reduxjs/toolkit';
import type { InsurancePolicy } from '../domain/entities/insurancePolicy';

const policiesAdapter = createEntityAdapter<InsurancePolicy>({
  sortComparer: (a, b) => a.endDate.localeCompare(b.endDate),
});

const slice = createSlice({
  name: 'policies',
  initialState: policiesAdapter.getInitialState(),
  reducers: {
    upsertPolicy: policiesAdapter.upsertOne,
    upsertPolicies: policiesAdapter.upsertMany,
    removePolicy: policiesAdapter.removeOne,
    addDocumentToPolicy(state, action: PayloadAction<{ policyId: string; documentId: string }>) {
      const p = state.entities[action.payload.policyId];
      if (p && !p.documents.includes(action.payload.documentId)) p.documents.push(action.payload.documentId);
    },
    addReminderToPolicy(state, action: PayloadAction<{ policyId: string; reminderId: string }>) {
      const p = state.entities[action.payload.policyId];
      if (p && !p.reminders.includes(action.payload.reminderId)) p.reminders.push(action.payload.reminderId);
    },
    removeReminderFromPolicy(state, action: PayloadAction<{ policyId: string; reminderId: string }>) {
      const p = state.entities[action.payload.policyId];
      if (p) p.reminders = p.reminders.filter(id => id !== action.payload.reminderId);
    },
  },
});

export const policiesSelectors = policiesAdapter.getSelectors((s: any) => s.policies);
export const selectPoliciesByType = (type: InsurancePolicy['type']) =>
  createSelector(policiesSelectors.selectAll, all => all.filter(p => p.type === type));

export const { actions: policiesActions, reducer: policiesReducer } = slice;
