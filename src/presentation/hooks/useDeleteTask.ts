import { useCallback } from 'react';
import type { DeleteTaskInput } from '@/application/use-cases/tasks';
import { useAppDependencies } from '@/presentation/providers';
import { useMutation } from './useMutation';

export function useDeleteTask() {
  const { deleteTask } = useAppDependencies();

  const fn = useCallback(
    async (input: DeleteTaskInput): Promise<void> => {
      await deleteTask.execute(input);
    },
    [deleteTask],
  );

  return useMutation(fn);
}
