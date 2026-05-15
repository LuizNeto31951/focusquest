import { useCallback, useMemo } from 'react';
import {
  useCurrentUser,
  useTasks,
  useCategories,
  useCompleteTask,
  useDeleteTask,
} from '@/presentation/hooks';
import { useTasksStore } from '@/presentation/stores';
import { ISODate, type UniqueId } from '@/shared/types';
import type { ListTasksInput } from '@/application/use-cases/tasks';

export function useTasksScreen() {
  const { user } = useCurrentUser();
  const filters = useTasksStore((s) => s.filters);
  const setFilters = useTasksStore((s) => s.setFilters);
  const { categories } = useCategories();
  const completeTask = useCompleteTask();
  const deleteTask = useDeleteTask();

  const queryInput = useMemo<ListTasksInput>(() => {
    const userId = user?.id ?? ('' as never);
    if (filters.mode === 'TODAY') {
      return {
        userId,
        onlyTopLevel: true,
        dueOnDay: ISODate.now(),
        onlyPending: true,
      };
    }
    if (filters.mode === 'COMPLETED') {
      return { userId, onlyTopLevel: true, onlyCompleted: true };
    }
    if (filters.mode === 'BY_CATEGORY' && filters.categoryId) {
      return { userId, onlyTopLevel: true, categoryId: filters.categoryId };
    }
    return { userId, onlyTopLevel: true };
  }, [user?.id, filters]);

  const { tasks, loading, refetch } = useTasks(queryInput);

  const toggleComplete = useCallback(
    async (taskId: UniqueId) => {
      await completeTask.run({ taskId });
      refetch();
    },
    [completeTask, refetch],
  );

  const remove = useCallback(
    async (taskId: UniqueId) => {
      await deleteTask.run({ id: taskId });
      refetch();
    },
    [deleteTask, refetch],
  );

  return {
    user,
    tasks,
    loading,
    categories,
    filters,
    setFilters,
    toggleComplete,
    remove,
    refetch,
  };
}
