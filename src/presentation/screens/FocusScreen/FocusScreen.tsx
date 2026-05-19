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

  const blockingLabel = !vm.blockerSupported
    ? 'Indisponível (precisa de dev build Android)'
    : !vm.blockerReady
      ? 'Configurar permissões'
      : vm.blockedCount === 0
        ? 'Escolher apps para bloquear'
        : `${vm.blockedCount} app${vm.blockedCount > 1 ? 's' : ''} bloqueado${vm.blockedCount > 1 ? 's' : ''}`;

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
        <Typography variant="label" color="secondary">Duração do foco</Typography>
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

      <View style={styles.section}>
        <Typography variant="label" color="secondary">Ciclos Pomodoro</Typography>
        <View style={styles.row}>
          {vm.pomodoroCycleOptions.map((c) => (
            <Chip
              key={c}
              label={c === 1 ? 'Sem ciclos' : `${c} ciclos`}
              selected={vm.pomodoroCycles === c}
              onPress={() => vm.setPomodoroCycles(c)}
            />
          ))}
        </View>
      </View>

      {vm.pomodoroEnabled ? (
        <View style={styles.section}>
          <Typography variant="label" color="secondary">Pausa entre ciclos</Typography>
          <View style={styles.row}>
            {vm.pomodoroBreakOptions.map((b) => (
              <Chip
                key={b}
                label={`${b} min`}
                selected={vm.pomodoroBreakMinutes === b}
                onPress={() => vm.setPomodoroBreakMinutes(b)}
              />
            ))}
          </View>
        </View>
      ) : null}

      <View style={styles.section}>
        <Typography variant="label" color="secondary">
          Bloqueio de apps
        </Typography>
        <Button
          label={blockingLabel}
          variant="secondary"
          fullWidth
          disabled={!vm.blockerSupported}
          onPress={() => navigation.navigate('BlockedApps')}
        />
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
