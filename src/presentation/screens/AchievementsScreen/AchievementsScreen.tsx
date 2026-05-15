import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Trophy } from 'lucide-react-native';
import {
  Screen,
  Typography,
  AchievementBadge,
  EmptyState,
} from '@/presentation/components';
import { useTheme } from '@/presentation/providers';
import { useAchievementsScreen } from './useAchievementsScreen';
import { createStyles } from './AchievementsScreen.styles';

export function AchievementsScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const vm = useAchievementsScreen();

  return (
    <Screen scroll>
      <View style={styles.header}>
        <Typography variant="h2">Conquistas</Typography>
        <Typography variant="body" color="secondary">
          {vm.unlockedCount} de {vm.total} desbloqueadas
        </Typography>
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
            <AchievementBadge
              key={entry.achievement.code}
              achievement={entry.achievement}
              unlocked={Boolean(entry.unlockedAt)}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}
