import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store, persistor } from '../src/store';
import { PersistGate } from 'redux-persist/integration/react';
import { LoadingView } from '../src/ui/feedback/LoadingView';

export default function Layout() {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingView />} persistor={persistor}>
        <Stack screenOptions={{ headerShadowVisible: false }} />
      </PersistGate>
    </Provider>
  );
}
