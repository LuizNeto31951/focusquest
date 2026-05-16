import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RewardsShopScreen } from '@/presentation/screens/RewardsShopScreen';
import { RewardEditorScreen } from '@/presentation/screens/RewardEditorScreen';
import { RedemptionsScreen } from '@/presentation/screens/RedemptionsScreen';
import { useTheme } from '@/presentation/providers';
import type { ShopStackParamList } from './types';

const Stack = createNativeStackNavigator<ShopStackParamList>();

export function ShopStack() {
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
        name="RewardsShop"
        component={RewardsShopScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RewardEditor"
        component={RewardEditorScreen}
        options={{ title: 'Recompensa' }}
      />
      <Stack.Screen
        name="Redemptions"
        component={RedemptionsScreen}
        options={{ title: 'Histórico' }}
      />
    </Stack.Navigator>
  );
}
