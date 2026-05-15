import React, { useMemo } from 'react';
import { View } from 'react-native';
import { ListChecks } from 'lucide-react-native';
import {
  Screen,
  Typography,
  Card,
  XPBar,
  LevelBadge,
  StreakIndicator,
  TaskCard,
  EmptyState,
} from '@/presentation/components';
import { useTheme } from '@/presentation/providers';
import { useCategories, useCompleteTask } from '@/presentation/hooks';
import { useHomeScreen } from './useHomeScreen';
import { createStyles } from './HomeScreen.styles';

export function HomeScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { user, stats, pendingTasksToday, refetchTasks } = useHomeScreen();
  const { categories } = useCategories();
  const completeTask = useCompleteTask();

  const categoryById = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories],
  );

  return (
    <Screen scroll>
      <View style={styles.headerRow}>
        <LevelBadge level={stats?.level ?? 1} />
        <View style={styles.headerText}>
          <Typography variant="h2">{user?.name ?? 'Olá'}</Typography>
          {stats ? (
            <StreakIndicator days={stats.currentStreakDays} />
          ) : null}
        </View>
      </View>

      <Card style={styles.statsCard}>
        {stats ? (
          <XPBar
            level={stats.level}
            progress={stats.progressInCurrentLevel}
            xpRemaining={stats.xpRemainingToNextLevel}
          />
        ) : (
          <Typography variant="body" color="secondary">
            Carregando estatísticas...
          </Typography>
        )}
        <View style={styles.statsRow}>
          <Typography variant="caption" color="secondary">
            XP total: {stats?.totalXP ?? 0}
          </Typography>
          <Typography variant="caption" color="secondary">
            Recorde: {stats?.longestStreakDays ?? 0} dias
          </Typography>
        </View>
      </Card>

      <View style={styles.sectionHeader}>
        <Typography variant="h3">Suas tarefas de hoje</Typography>
      </View>

      {pendingTasksToday.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="Sem tarefas para hoje"
          description="Crie uma tarefa pela aba Tarefas."
        />
      ) : (
        <View style={styles.list}>
          {pendingTasksToday.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              category={categoryById.get(task.categoryId)}
              onToggleComplete={async () => {
                await completeTask.run({ taskId: task.id });
                refetchTasks();
              }}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}
