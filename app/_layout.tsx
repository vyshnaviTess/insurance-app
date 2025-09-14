import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store, persistor } from '../src/store';
import { PersistGate } from 'redux-persist/integration/react';
import { LoadingView } from '../src/ui/feedback/LoadingView';
import { StatusBar, StyleSheet } from 'react-native';

export default function Layout() {
  return (
   <Provider store={store}>
      <PersistGate loading={<LoadingView />} persistor={persistor}>
      <StatusBar
          barStyle="dark-content"   // dark text/icons
          backgroundColor="#fff"    // match header background
          translucent={false}       // ensures header is below status bar
        />
        <Stack screenOptions={{
            headerShadowVisible: false,
            headerStyle: styles.header,          
            headerTitleStyle: styles.headerTitle, 
            headerTitleAlign: "center",          
          }} >
          <Stack.Screen name="index" options={{ title: "Insurance Manager" }} />
          <Stack.Screen name="policy/new" options={{ title: "New Policy" }} />
          <Stack.Screen name="policy/[id]" options={{ title: "Policy Details" }} />
          <Stack.Screen name="policy/[id]/editPolicy" options={{ title: "Edit Policy" }} />
          <Stack.Screen name="policy/[id]/deletePolicy" options={{ title: "Delete Policy" }} />
          <Stack.Screen name="policy/[id]/addDocument" options={{ title: "Add Document" }} />
          <Stack.Screen name="policy/[id]/addReminder" options={{ title: "Add Reminder" }} />
          <Stack.Screen name="document/[documentId]" options={{ title: "Document Viewer" }} />
        </Stack>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fff", // white background for all headers
  },
  headerTitle: {
    fontSize: 22, // bigger title
    fontWeight: "600",
    color: "#1C1C1E", // dark gray / black
  },
});