import React, { useMemo } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Trophy, Trash2 } from 'lucide-react-native';
import {
  Button,
  Screen,
  Typography,
  AchievementBadge,
  EmptyState,
  Icon,
} from '@/presentation/components';
import { useTheme } from '@/presentation/providers';
import type { AchievementsStackParamList } from '@/presentation/navigation/types';
import { useAchievementsScreen } from './useAchievementsScreen';
import { createStyles } from './AchievementsScreen.styles';

export function AchievementsScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const navigation =
    useNavigation<NativeStackNavigationProp<AchievementsStackParamList>>();
  const vm = useAchievementsScreen();

  function confirmDelete(code: string, name: string) {
    Alert.alert(
      'Excluir meta',
      `Tem certeza que deseja remover "${name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await vm.remove(code);
            } catch (err) {
              Alert.alert(
                'Não foi possível excluir',
                (err as Error).message,
              );
            }
          },
        },
      ],
    );
  }

  return (
    <Screen scroll>
      <View style={styles.header}>
        <Typography variant="h2">Conquistas</Typography>
        <Typography variant="body" color="secondary">
          {vm.unlockedCount} de {vm.total} desbloqueadas
        </Typography>
        <Typography variant="caption" color="secondary">
          Conquistas desbloqueiam automaticamente conforme você usa o app, e cada uma dá moedas extras. Crie também as suas próprias metas.
        </Typography>
      </View>

      <View style={styles.createButton}>
        <Button
          label="Criar meta personalizada"
          variant="secondary"
          fullWidth
          onPress={() => navigation.navigate('AchievementEditor')}
        />
      </View>

      {vm.achievements.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="Nada por aqui ainda"
          description="Complete tarefas para desbloquear suas primeiras conquistas."
        />
      ) : (
        <View style={styles.grid}>
          {vm.achievements.map((entry) => (
            <View key={entry.achievement.code} style={styles.badgeWrapper}>
              <AchievementBadge
                achievement={entry.achievement}
                unlocked={Boolean(entry.unlockedAt)}
              />
              {entry.achievement.isCustom ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Excluir ${entry.achievement.name}`}
                  onPress={() =>
                    confirmDelete(
                      entry.achievement.code,
                      entry.achievement.name,
                    )
                  }
                  style={[
                    styles.deleteFab,
                    { backgroundColor: theme.colors.danger },
                  ]}
                  hitSlop={8}
                >
                  <Icon
                    name={Trash2}
                    size={14}
                    color={theme.colors.textOnAccent}
                  />
                </Pressable>
              ) : null}
            </View>
          ))}
        </View>
      )}
    </Screen>
  );
}
