import React, { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Screen,
  Typography,
  Card,
  Button,
  Chip,
} from '@/presentation/components';
import { useTheme } from '@/presentation/providers';
import type { FocusStackParamList } from '@/presentation/navigation/types';
import { useFocusScreen } from './useFocusScreen';
import { createStyles } from './FocusScreen.styles';

export function FocusScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const navigation =
    useNavigation<NativeStackNavigationProp<FocusStackParamList>>();
  const vm = useFocusScreen();

  useEffect(() => {
    if (vm.activeSession) {
      navigation.navigate('FocusActive', { sessionId: vm.activeSession.id });
    }
  }, [vm.activeSession, navigation]);

  async function handleStart() {
    const session = await vm.start();
    if (session) navigation.navigate('FocusActive', { sessionId: session.id });
  }

  return (
    <Screen scroll>
      <Typography variant="h2" style={styles.section}>
        Modo Foco
      </Typography>

      <Card style={styles.section}>
        <Typography variant="body" color="secondary">
          Escolha a duração e dedique-se a uma tarefa sem distrações.
        </Typography>
      </Card>

      <View style={styles.section}>
        <Typography variant="label" color="secondary">Duração</Typography>
        <View style={styles.row}>
          {vm.durations.map((d) => (
            <Chip
              key={d}
              label={`${d} min`}
              selected={vm.selectedDuration === d}
              onPress={() => vm.setSelectedDuration(d)}
            />
          ))}
        </View>
      </View>

      {vm.error ? (
        <Typography variant="caption" color="danger">
          {vm.error.message}
        </Typography>
      ) : null}

      <Button
        label="Iniciar sessão"
        fullWidth
        loading={vm.loading}
        onPress={handleStart}
      />
    </Screen>
  );
}
