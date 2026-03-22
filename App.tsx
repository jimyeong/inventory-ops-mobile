/**
 * Owlverload Analytics App
 *
 * @format
 */
import './gesture-handler';
import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/v1/shared/ui/Toast/BaseToast';
import Config from 'react-native-config';

// import './src/firebase/config';


function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          />
        <AuthProvider>
            <AppNavigator />
        </AuthProvider>
        <Toast config={toastConfig}/>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
