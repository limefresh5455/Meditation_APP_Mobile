import 'react-native-gesture-handler'; // for animations
import React from 'react';
import { Navigation } from './src/navigation/Navigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Platform, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './src/redux/store';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar
        barStyle={'light-content'}
        translucent={Platform.OS === 'ios'}
        backgroundColor="transparent"
      />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Navigation />
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
