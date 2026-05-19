import React, { useMemo, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { Screen, Typography, Button } from '@/presentation/components';
import { StopFocusConfirmModal } from '@/presentation/components/StopFocusConfirmModal';
import { useTheme } from '@/presentation/providers';
import type { FocusStackParamList } from '@/presentation/navigation/types';
import { useFocusExitAds } from '@/presentation/hooks/useFocusExitAds';
import { useFocusActiveScreen } from './useFocusActiveScreen';
import { createStyles } from './FocusActiveScreen.styles';

type RouteProp = NativeStackScreenProps<FocusStackParamList, 'FocusActive'>['route'];

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function FocusActiveScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const navigation =
    useNavigation<NativeStackNavigationProp<FocusStackParamList>>();
  const route = useRoute<RouteProp>();
  const vm = useFocusActiveScreen(route.params.sessionId);
  const { showRewardedAd, loadingAds } = useFocusExitAds();

  const [pendingInterrupted, setPendingInterrupted] = useState<boolean | null>(null);

  async function handleFinish(interrupted: boolean) {
    await vm.stop(interrupted);
    navigation.goBack();
  }

  function requestStop(interrupted: boolean) {
    setPendingInterrupted(interrupted);
  }

  async function handleConfirmStop() {
    if (pendingInterrupted === null) return;
    const interrupted = pendingInterrupted;

    const rewarded = await showRewardedAd();
    if (!rewarded) {
      Alert.alert(
        'Recompensa não recebida',
        'Assista o anúncio até o fim para encerrar o modo foco.',
      );
      return;
    }

    setPendingInterrupted(null);
    await handleFinish(interrupted);
  }

  if (!vm.activeSession) {
    return (
      <Screen>
        <Typography variant="body" color="secondary">
          Nenhuma sessão ativa.
        </Typography>
      </Screen>
    );
  }

  const pomo = vm.pomodoroState;
  const isBreak = pomo?.phase === 'break';

  const phaseLabel = pomo
    ? pomo.phase === 'focus'
      ? 'Foco'
      : pomo.phase === 'break'
        ? 'Pausa'
        : 'Concluído'
    : vm.finished
      ? 'Sessão concluída'
      : 'Tempo restante';

  return (
    <Screen>
      <View style={styles.container}>
        <Typography
          variant="label"
          color={isBreak ? 'success' : 'secondary'}
          style={styles.phaseLabel}
        >
          {phaseLabel}
        </Typography>

        {pomo ? (
          <View style={styles.cycleIndicator}>
            {Array.from({ length: pomo.totalCycles }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.cycleDot,
                  {
                    backgroundColor:
                      i + 1 < pomo.cycle
                        ? theme.colors.success
                        : i + 1 === pomo.cycle
                          ? isBreak
                            ? theme.colors.success
                            : theme.colors.accent
                          : theme.colors.border,
                  },
                ]}
              />
            ))}
            <Typography variant="caption" color="secondary">
              {pomo.cycle}/{pomo.totalCycles}
            </Typography>
          </View>
        ) : null}

        <Text style={[styles.timer, isBreak && styles.timerBreak]}>
          {formatTime(vm.remainingSeconds)}
        </Text>

        <View style={styles.actions}>
          {vm.finished ? (
            <Button
              label="Concluir sessão"
              fullWidth
              loading={vm.loading}
              onPress={() => handleFinish(false)}
            />
          ) : isBreak ? (
            <Button
              label="Encerrar (interrompida)"
              variant="danger"
              fullWidth
              loading={vm.loading}
              onPress={() => requestStop(true)}
            />
          ) : (
            <>
              <Button
                label="Concluir antes"
                variant="secondary"
                fullWidth
                loading={vm.loading}
                onPress={() => requestStop(false)}
              />
              <Button
                label="Encerrar (interrompida)"
                variant="danger"
                fullWidth
                loading={vm.loading}
                onPress={() => requestStop(true)}
              />
            </>
          )}
        </View>
      </View>

      <StopFocusConfirmModal
        visible={pendingInterrupted !== null}
        loading={loadingAds}
        onCancel={() => setPendingInterrupted(null)}
        onConfirm={handleConfirmStop}
      />
    </Screen>
  );
}
