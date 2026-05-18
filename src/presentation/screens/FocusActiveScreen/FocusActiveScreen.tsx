import React, { useMemo, useState } from 'react';
import { Alert, View, Text } from 'react-native';
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
  const { showTwoAds, loadingAds } = useFocusExitAds();

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

    const success = await showTwoAds();
    if (!success) {
      Alert.alert(
        'Sem conexão',
        'Não foi possível carregar os anúncios. Verifique sua conexão e tente novamente.',
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

  const finished = vm.remainingSeconds === 0;

  return (
    <Screen>
      <View style={styles.container}>
        <Typography variant="label" color="secondary">
          {finished ? 'Sessão concluída' : 'Tempo restante'}
        </Typography>
        <Text style={styles.timer}>
          {formatTime(finished ? vm.secondsElapsed : vm.remainingSeconds)}
        </Text>
        <View style={styles.actions}>
          {finished ? (
            <Button
              label="Concluir sessão"
              fullWidth
              loading={vm.loading}
              onPress={() => handleFinish(false)}
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
