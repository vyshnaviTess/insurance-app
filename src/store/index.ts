import { configureStore, combineReducers } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore } from 'redux-persist';
import { policiesReducer } from './policiesSlice';
import { documentsReducer } from './documentSlice';
import { remindersReducer } from './remindersSlice';
import { offlineQueueReducer } from './offlineQueueSlice';
import offlineSync from './middleware/offlineSync';

const rootReducer = combineReducers({
  policies: policiesReducer,
  documents: documentsReducer,
  reminders: remindersReducer,
  offlineQueue: offlineQueueReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['policies', 'documents', 'reminders', 'offlineQueue'],
};

export const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware: getDefault => getDefault({ serializableCheck: false }).concat(offlineSync),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
