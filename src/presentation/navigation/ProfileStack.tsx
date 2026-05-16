import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileScreen } from '@/presentation/screens/ProfileScreen';
import { SettingsScreen } from '@/presentation/screens/SettingsScreen';
import { EditProfileScreen } from '@/presentation/screens/EditProfileScreen';
import { CategoriesScreen } from '@/presentation/screens/CategoriesScreen';
import { CategoryEditorScreen } from '@/presentation/screens/CategoryEditorScreen';
import { useTheme } from '@/presentation/providers';
import type { ProfileStackParamList } from './types';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileStack() {
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
        name="ProfileHome"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Configurações' }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Editar perfil' }}
      />
      <Stack.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{ title: 'Categorias' }}
      />
      <Stack.Screen
        name="CategoryEditor"
        component={CategoryEditorScreen}
        options={{ title: 'Categoria' }}
      />
    </Stack.Navigator>
  );
}
