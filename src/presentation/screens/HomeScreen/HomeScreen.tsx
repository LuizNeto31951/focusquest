import React, { useMemo } from 'react';
import { View, Alert, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { ListChecks } from 'lucide-react-native';
import {
  Screen,
  Typography,
  Card,
  XPBar,
  Avatar,
  CoinBadge,
  StreakIndicator,
  TaskCard,
  EmptyState,
} from '@/presentation/components';
import { useTheme } from '@/presentation/providers';
import { useCategories, useCompleteTask } from '@/presentation/hooks';
import type { RootTabParamList } from '@/presentation/navigation/types';
import { useHomeScreen } from './useHomeScreen';
import { createStyles } from './HomeScreen.styles';

export function HomeScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const navigation =
    useNavigation<BottomTabNavigationProp<RootTabParamList>>();
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
        <View style={styles.avatarWrapper}>
          <Avatar
            name={user?.name ?? 'Você'}
            uri={user?.avatarUri}
            size={64}
          />
          <View style={styles.levelBadge}>
            <Typography
              variant="caption"
              style={{
                color: theme.colors.textOnAccent,
                fontWeight: '700',
              }}
            >
              {stats?.level ?? 1}
            </Typography>
          </View>
        </View>
        <View style={styles.headerText}>
          <Typography variant="h2">{user?.name ?? 'Olá'}</Typography>
          {stats ? (
            <StreakIndicator days={stats.currentStreakDays} />
          ) : null}
        </View>
        <Pressable
          onPress={() => navigation.navigate('Shop', { screen: 'RewardsShop' })}
          accessibilityRole="button"
          accessibilityLabel="Abrir lojinha"
          hitSlop={8}
        >
          <CoinBadge amount={user?.coins ?? 0} size="md" variant="solid" />
        </Pressable>
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
          {pendingTasksToday.map((entry) => (
            <TaskCard
              key={entry.task.id}
              task={entry.task}
              category={categoryById.get(entry.task.categoryId)}
              isCompletedToday={entry.isCompletedToday}
              isRecurringInstance={entry.isRecurringInstance}
              onToggleComplete={async () => {
                try {
                  await completeTask.run({ taskId: entry.task.id });
                  refetchTasks();
                } catch (err) {
                  Alert.alert(
                    'Não foi possível concluir',
                    (err as Error).message,
                  );
                }
              }}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}
