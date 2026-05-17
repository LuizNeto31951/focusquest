import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FocusScreen } from '@/presentation/screens/FocusScreen';
import { FocusActiveScreen } from '@/presentation/screens/FocusActiveScreen';
import { BlockedAppsScreen } from '@/presentation/screens/BlockedAppsScreen';
import { useTheme } from '@/presentation/providers';
import type { FocusStackParamList } from './types';

const Stack = createNativeStackNavigator<FocusStackParamList>();

export function FocusStack() {
  const theme = useTheme();
  const reduceMotion = theme.preferences.reduceMotion;
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.background },
        headerTintColor: theme.colors.textPrimary,
        contentStyle: { backgroundColor: theme.colors.background },
        animation: reduceMotion ? 'none' : 'fade',
        animationDuration: 220,
      }}
    >
      <Stack.Screen
        name="FocusHome"
        component={FocusScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FocusActive"
        component={FocusActiveScreen}
        options={{ title: 'Em foco' }}
      />
      <Stack.Screen
        name="BlockedApps"
        component={BlockedAppsScreen}
        options={{ title: 'Bloqueio de apps' }}
      />
    </Stack.Navigator>
  );
}
