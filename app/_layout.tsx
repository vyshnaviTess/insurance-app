import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store, persistor } from '../src/store';
import { PersistGate } from 'redux-persist/integration/react';
import { LoadingView } from '../src/ui/feedback/LoadingView';

export default function Layout() {
  return (
   <Provider store={store}>
      <PersistGate loading={<LoadingView />} persistor={persistor}>
        <Stack screenOptions={{ headerShadowVisible: false }}>
          <Stack.Screen name="index" options={{ title: "Insurance Manager" }} />
          <Stack.Screen name="policy/new" options={{ title: "New Policy" }} />
          <Stack.Screen name="policy/[id]" options={{ title: "Policy Details" }} />
          <Stack.Screen name="policy/[id]/edit" options={{ title: "Edit Policy" }} />
          <Stack.Screen name="policy/[id]/delete" options={{ title: "Delete Policy" }} />
          <Stack.Screen name="policy/[id]/addDocument" options={{ title: "Add Document" }} />
          <Stack.Screen name="policy/[id]/addReminder" options={{ title: "Add Reminder" }} />
          <Stack.Screen name="documents/[documentId]" options={{ title: "Document Viewer" }} />
        </Stack>
      </PersistGate>
    </Provider>
  );
}
