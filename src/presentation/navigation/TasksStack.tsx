import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TasksScreen } from '@/presentation/screens/TasksScreen';
import { TaskDetailScreen } from '@/presentation/screens/TaskDetailScreen';
import { TaskFormScreen } from '@/presentation/screens/TaskFormScreen';
import { useTheme } from '@/presentation/providers';
import type { TasksStackParamList } from './types';

const Stack = createNativeStackNavigator<TasksStackParamList>();

export function TasksStack() {
  const theme = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.background },
        headerTintColor: theme.colors.textPrimary,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen
        name="TasksList"
        component={TasksScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TaskDetail"
        component={TaskDetailScreen}
        options={{ title: 'Tarefa' }}
      />
      <Stack.Screen
        name="TaskForm"
        component={TaskFormScreen}
        options={{ title: 'Tarefa', presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}
