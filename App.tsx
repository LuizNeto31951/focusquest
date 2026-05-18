import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import mobileAds from 'react-native-google-mobile-ads';
import { ThemeProvider, AppBootstrap } from '@/presentation/providers';
import { RootNavigator } from '@/presentation/navigation';
import { GamificationFeedback } from '@/presentation/components';

export default function App() {
  useEffect(() => {
    mobileAds().initialize();
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppBootstrap defaultUserName="Você">
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
          <GamificationFeedback />
        </AppBootstrap>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
