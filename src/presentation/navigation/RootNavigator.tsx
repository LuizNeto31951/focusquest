import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, ListChecks, Target, Trophy, User } from 'lucide-react-native';
import { HomeScreen } from '@/presentation/screens/HomeScreen';
import { AchievementsScreen } from '@/presentation/screens/AchievementsScreen';
import { ProfileScreen } from '@/presentation/screens/ProfileScreen';
import { Icon } from '@/presentation/components';
import { useTheme } from '@/presentation/providers';
import { TasksStack } from './TasksStack';
import { FocusStack } from './FocusStack';
import type { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

export function RootNavigator() {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Icon name={Home} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Tasks"
        component={TasksStack}
        options={{
          title: 'Tarefas',
          tabBarIcon: ({ color, size }) => (
            <Icon name={ListChecks} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Focus"
        component={FocusStack}
        options={{
          title: 'Foco',
          tabBarIcon: ({ color, size }) => (
            <Icon name={Target} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Achievements"
        component={AchievementsScreen}
        options={{
          title: 'Conquistas',
          tabBarIcon: ({ color, size }) => (
            <Icon name={Trophy} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Icon name={User} size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
