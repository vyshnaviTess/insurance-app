import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import type { Document } from '../domain/entities/document';

const docs = createEntityAdapter<Document>({ sortComparer: (a,b)=>b.createdAt.localeCompare(a.createdAt) });
const slice = createSlice({
  name: 'documents',
  initialState: docs.getInitialState(),
  reducers: {
    upsertDocument: docs.upsertOne,
    upsertDocuments: docs.upsertMany, 
    removeDocument: docs.removeOne,
  },
});
export const { reducer: documentsReducer, actions: documentsActions, } = slice;
export const documentsSelectors = docs.getSelectors((s:any)=>s.documents);
