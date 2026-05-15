import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, AppBootstrap } from '@/presentation/providers';
import { RootNavigator } from '@/presentation/navigation';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppBootstrap defaultUserName="Você">
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </AppBootstrap>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
