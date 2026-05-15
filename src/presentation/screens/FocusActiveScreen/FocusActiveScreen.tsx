import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { Screen, Typography, Button } from '@/presentation/components';
import { useTheme } from '@/presentation/providers';
import type { FocusStackParamList } from '@/presentation/navigation/types';
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

  async function handleFinish(interrupted: boolean) {
    await vm.stop(interrupted);
    navigation.goBack();
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
                onPress={() => handleFinish(false)}
              />
              <Button
                label="Encerrar (interrompida)"
                variant="danger"
                fullWidth
                loading={vm.loading}
                onPress={() => handleFinish(true)}
              />
            </>
          )}
        </View>
      </View>
    </Screen>
  );
}
