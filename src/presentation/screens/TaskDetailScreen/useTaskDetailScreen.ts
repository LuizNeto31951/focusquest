import { useCallback } from 'react';
import { UniqueId } from '@/shared/types';
import {
  useCategories,
  useCompleteTask,
  useDeleteTask,
  useTaskWithSubtasks,
} from '@/presentation/hooks';

export function useTaskDetailScreen(taskIdParam: string) {
  const taskId = UniqueId.from(taskIdParam);
  const { data, loading, refetch } = useTaskWithSubtasks(taskId);
  const { categories } = useCategories();
  const completeTask = useCompleteTask();
  const deleteTask = useDeleteTask();

  const category = data
    ? categories.find((c) => c.id === data.task.categoryId)
    : undefined;

  const complete = useCallback(async () => {
    await completeTask.run({ taskId });
    refetch();
  }, [completeTask, taskId, refetch]);

  const completeSubtask = useCallback(
    async (subId: UniqueId) => {
      await completeTask.run({ taskId: subId });
      refetch();
    },
    [completeTask, refetch],
  );

  const remove = useCallback(async () => {
    await deleteTask.run({ id: taskId });
  }, [deleteTask, taskId]);

  return {
    taskId,
    data,
    loading,
    category,
    complete,
    completeSubtask,
    remove,
    busy: completeTask.loading || deleteTask.loading,
  };
}
