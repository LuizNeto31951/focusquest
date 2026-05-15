import React, { useMemo } from 'react';
import { View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Plus, ListTodo } from 'lucide-react-native';
import {
  Screen,
  Typography,
  Chip,
  TaskCard,
  EmptyState,
  Icon,
} from '@/presentation/components';
import { useTheme } from '@/presentation/providers';
import type { TasksStackParamList } from '@/presentation/navigation/types';
import type { TaskListMode } from '@/presentation/stores';
import { useTasksScreen } from './useTasksScreen';
import { createStyles } from './TasksScreen.styles';

const MODE_LABELS: Record<TaskListMode, string> = {
  TODAY: 'Hoje',
  ALL: 'Todas',
  COMPLETED: 'Concluídas',
  BY_CATEGORY: 'Categoria',
};

export function TasksScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const navigation =
    useNavigation<NativeStackNavigationProp<TasksStackParamList>>();
  const { tasks, categories, filters, setFilters, toggleComplete } =
    useTasksScreen();

  const categoryById = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories],
  );

  return (
    <Screen scroll>
      <View style={styles.header}>
        <Typography variant="h2">Tarefas</Typography>
      </View>

      <View style={styles.filterRow}>
        {(['TODAY', 'ALL', 'COMPLETED'] as TaskListMode[]).map((mode) => (
          <Chip
            key={mode}
            label={MODE_LABELS[mode]}
            selected={filters.mode === mode}
            onPress={() => setFilters({ mode })}
          />
        ))}
      </View>

      {filters.mode === 'BY_CATEGORY' || categories.length > 0 ? (
        <View style={styles.filterRow}>
          {categories.map((cat) => (
            <Chip
              key={cat.id}
              label={cat.name}
              color={cat.color}
              selected={filters.mode === 'BY_CATEGORY' && filters.categoryId === cat.id}
              onPress={() =>
                setFilters({ mode: 'BY_CATEGORY', categoryId: cat.id })
              }
            />
          ))}
        </View>
      ) : null}

      {tasks.length === 0 ? (
        <EmptyState
          icon={ListTodo}
          title="Nenhuma tarefa por aqui"
          description="Toque no botão + para criar uma."
        />
      ) : (
        <View style={styles.list}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              category={categoryById.get(task.categoryId)}
              onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}
              onToggleComplete={() => toggleComplete(task.id)}
            />
          ))}
        </View>
      )}

      <Pressable
        onPress={() => navigation.navigate('TaskForm', {})}
        accessibilityRole="button"
        accessibilityLabel="Nova tarefa"
        style={styles.fab}
      >
        <Icon name={Plus} size={28} color={theme.colors.textOnAccent} />
      </Pressable>
    </Screen>
  );
}
