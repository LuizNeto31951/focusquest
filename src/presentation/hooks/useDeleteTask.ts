import { useCallback } from 'react';
import type { DeleteTaskInput } from '@/application/use-cases/tasks';
import { useAppDependencies } from '@/presentation/providers';
import { useTasksStore } from '@/presentation/stores';
import { useMutation } from './useMutation';

export function useDeleteTask() {
  const { deleteTask } = useAppDependencies();
  const removeTask = useTasksStore((s) => s.removeTask);

  const fn = useCallback(
    async (input: DeleteTaskInput): Promise<void> => {
      await deleteTask.execute(input);
      removeTask(input.id);
    },
    [deleteTask, removeTask],
  );

  return useMutation(fn);
}
