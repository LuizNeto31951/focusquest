import React, { useMemo } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Check, Circle, CalendarClock } from 'lucide-react-native';
import { useTheme } from '@/presentation/providers';
import { Typography } from '@/presentation/components/Typography';
import { Icon } from '@/presentation/components/Icon';
import { PriorityChip } from '@/presentation/components/PriorityChip';
import { CategoryChip } from '@/presentation/components/CategoryChip';
import type { Task, Category } from '@/domain/entities';
import { isTaskCompleted, isTaskOverdue } from '@/domain/entities';
import { ISODate } from '@/shared/types';

interface TaskCardProps {
  task: Task;
  category?: Category;
  onPress?: () => void;
  onToggleComplete?: () => void;
}

export function TaskCard({
  task,
  category,
  onPress,
  onToggleComplete,
}: TaskCardProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const completed = isTaskCompleted(task);
  const overdue = isTaskOverdue(task, ISODate.now());

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
        completed && styles.completed,
      ]}
    >
      <Pressable
        onPress={onToggleComplete}
        hitSlop={8}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: completed }}
        style={styles.checkbox}
      >
        <Icon
          name={completed ? Check : Circle}
          size={22}
          color={completed ? theme.colors.success : theme.colors.textSecondary}
        />
      </Pressable>
      <View style={styles.content}>
        <Typography
          variant="bodyEmphasis"
          style={completed ? styles.completedText : undefined}
        >
          {task.title}
        </Typography>
        <View style={styles.meta}>
          {category ? <CategoryChip category={category} /> : null}
          <PriorityChip priority={task.priority} />
          {task.dueDate ? (
            <View style={styles.due}>
              <Icon
                name={CalendarClock}
                size={14}
                color={overdue ? theme.colors.danger : theme.colors.textSecondary}
              />
              <Typography variant="caption" color={overdue ? 'danger' : 'secondary'}>
                {formatDueLabel(task.dueDate)}
              </Typography>
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

function formatDueLabel(due: string): string {
  try {
    const d = new Date(due);
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

function createStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      padding: theme.spacing.md,
      borderRadius: theme.radii.lg,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    pressed: {
      backgroundColor: theme.colors.surfaceMuted,
    },
    completed: {
      opacity: 0.7,
    },
    completedText: {
      textDecorationLine: 'line-through',
      color: theme.colors.textSecondary,
    },
    checkbox: {
      paddingTop: 2,
    },
    content: {
      flex: 1,
      gap: theme.spacing.sm,
    },
    meta: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    due: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
  });
}
