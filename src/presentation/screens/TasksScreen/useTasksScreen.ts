import { useCallback, useMemo } from 'react';
import {
  useCurrentUser,
  useTasks,
  useTodaysTasks,
  useCategories,
  useCompleteTask,
  useDeleteTask,
} from '@/presentation/hooks';
import { useTasksStore } from '@/presentation/stores';
import { ISODate, type UniqueId } from '@/shared/types';
import type { ListTasksInput } from '@/application/use-cases/tasks';
import type { Task } from '@/domain/entities';

export interface TaskListEntry {
  task: Task;
  isCompletedToday?: boolean;
  isRecurringInstance?: boolean;
}

export function useTasksScreen() {
  const { user } = useCurrentUser();
  const filters = useTasksStore((s) => s.filters);
  const setFilters = useTasksStore((s) => s.setFilters);
  const { categories } = useCategories();
  const completeTask = useCompleteTask();
  const deleteTask = useDeleteTask();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const today = useMemo(() => ISODate.now(), [user?.id]);

  const isTodayMode = filters.mode === 'TODAY';

  const queryInput = useMemo<ListTasksInput>(() => {
    const userId = user?.id ?? ('' as never);
    if (filters.mode === 'COMPLETED') {
      return { userId, onlyTopLevel: true, onlyCompleted: true };
    }
    if (filters.mode === 'BY_CATEGORY' && filters.categoryId) {
      return { userId, onlyTopLevel: true, categoryId: filters.categoryId };
    }
    return { userId, onlyTopLevel: true };
  }, [user?.id, filters]);

  const tasksQuery = useTasks(queryInput, !isTodayMode && Boolean(user));
  const todaysQuery = useTodaysTasks(user?.id, today, isTodayMode);

  const entries: TaskListEntry[] = useMemo(() => {
    if (isTodayMode) {
      return todaysQuery.tasks.map((t) => ({
        task: t.task,
        isCompletedToday: t.isCompletedToday,
        isRecurringInstance: t.isRecurringInstance,
      }));
    }
    return tasksQuery.tasks.map((task) => ({ task }));
  }, [isTodayMode, todaysQuery.tasks, tasksQuery.tasks]);

  const loading = isTodayMode ? todaysQuery.loading : tasksQuery.loading;
  const refetch = useCallback(() => {
    if (isTodayMode) todaysQuery.refetch();
    else tasksQuery.refetch();
  }, [isTodayMode, todaysQuery, tasksQuery]);

  const toggleComplete = useCallback(
    async (taskId: UniqueId) => {
      await completeTask.run({ taskId });
    },
    [completeTask],
  );

  const remove = useCallback(
    async (taskId: UniqueId) => {
      await deleteTask.run({ id: taskId });
    },
    [deleteTask],
  );

  return {
    user,
    entries,
    loading,
    categories,
    filters,
    setFilters,
    toggleComplete,
    remove,
    refetch,
  };
}
