import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@/presentation/providers';
import { HomeScreen } from '@/presentation/screens/HomeScreen';

/**
 * Composition root do app.
 * Aqui ficam apenas os providers globais e a entrada da navegação.
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <HomeScreen />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
