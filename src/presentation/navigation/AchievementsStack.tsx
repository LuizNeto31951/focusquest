import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AchievementsScreen } from '@/presentation/screens/AchievementsScreen';
import { AchievementEditorScreen } from '@/presentation/screens/AchievementEditorScreen';
import { useTheme } from '@/presentation/providers';
import type { AchievementsStackParamList } from './types';

const Stack = createNativeStackNavigator<AchievementsStackParamList>();

export function AchievementsStack() {
  const theme = useTheme();
  const reduceMotion = theme.preferences.reduceMotion;
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.background },
        headerTintColor: theme.colors.textPrimary,
        contentStyle: { backgroundColor: theme.colors.background },
        animation: reduceMotion ? 'none' : 'slide_from_right',
        animationDuration: 220,
      }}
    >
      <Stack.Screen
        name="AchievementsList"
        component={AchievementsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AchievementEditor"
        component={AchievementEditorScreen}
        options={{ title: 'Nova meta' }}
      />
    </Stack.Navigator>
  );
}
