import React, { useMemo, useState } from 'react';
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
  SortDropdown,
  StreakIndicator,
  TaskCard,
  EmptyState,
  type SortOption,
} from '@/presentation/components';
import { priorityOrder } from '@/domain/value-objects';
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

  const [sortKey, setSortKey] = useState<SortKey>('dueDate');

  const sortedTasks = useMemo(
    () => sortTasks(pendingTasksToday, sortKey, categoryById),
    [pendingTasksToday, sortKey, categoryById],
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
          description="Quando você criar tarefas com prazo ou recorrência, elas aparecem aqui no dia certo."
          action={{
            label: 'Ir para Tarefas',
            onPress: () =>
              navigation.navigate('Tasks', { screen: 'TasksList' }),
          }}
        />
      ) : (
        <>
          <View style={styles.sortRow}>
            <SortDropdown
              label="Ordenar por"
              value={sortKey}
              options={SORT_OPTIONS}
              onChange={setSortKey}
            />
          </View>
          <View style={styles.list}>
            {sortedTasks.map((entry) => (
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
        </>
      )}
    </Screen>
  );
}

type SortKey = 'dueDate' | 'priority' | 'category';

const SORT_OPTIONS: readonly SortOption<SortKey>[] = [
  { value: 'dueDate', label: 'Prazo' },
  { value: 'priority', label: 'Prioridade' },
  { value: 'category', label: 'Categoria' },
];

function sortTasks<T extends { task: { dueDate?: string; priority: 'LOW' | 'MEDIUM' | 'HIGH'; categoryId: string; title: string } }>(
  tasks: readonly T[],
  key: SortKey,
  categoryById: Map<string, { name: string }>,
): T[] {
  const copy = [...tasks];
  switch (key) {
    case 'dueDate':
      copy.sort((a, b) => {
        const aTime = a.task.dueDate ? new Date(a.task.dueDate).getTime() : Infinity;
        const bTime = b.task.dueDate ? new Date(b.task.dueDate).getTime() : Infinity;
        if (aTime !== bTime) return aTime - bTime;
        return a.task.title.localeCompare(b.task.title);
      });
      return copy;
    case 'priority':
      copy.sort((a, b) => {
        const diff = priorityOrder(b.task.priority) - priorityOrder(a.task.priority);
        if (diff !== 0) return diff;
        return a.task.title.localeCompare(b.task.title);
      });
      return copy;
    case 'category':
      copy.sort((a, b) => {
        const aName = categoryById.get(a.task.categoryId)?.name ?? '';
        const bName = categoryById.get(b.task.categoryId)?.name ?? '';
        const diff = aName.localeCompare(bName);
        if (diff !== 0) return diff;
        return a.task.title.localeCompare(b.task.title);
      });
      return copy;
  }
}
