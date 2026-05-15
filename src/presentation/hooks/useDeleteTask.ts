import { useCallback } from 'react';
import type { DeleteTaskInput } from '@/application/use-cases/tasks';
import { useAppDependencies } from '@/presentation/providers';
import { useInvalidationStore } from '@/presentation/stores';
import { useMutation } from './useMutation';

export function useDeleteTask() {
  const { deleteTask } = useAppDependencies();
  const bumpTasks = useInvalidationStore((s) => s.bumpTasks);

  const fn = useCallback(
    async (input: DeleteTaskInput): Promise<void> => {
      await deleteTask.execute(input);
      bumpTasks();
    },
    [deleteTask, bumpTasks],
  );

  return useMutation(fn);
}
