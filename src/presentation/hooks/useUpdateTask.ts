import { useCallback } from 'react';
import type { UpdateTaskInput } from '@/application/use-cases/tasks';
import type { Task } from '@/domain/entities';
import { useAppDependencies } from '@/presentation/providers';
import { useMutation } from './useMutation';

export function useUpdateTask() {
  const { updateTask } = useAppDependencies();

  const fn = useCallback(
    async (input: UpdateTaskInput): Promise<Task> => {
      return updateTask.execute(input);
    },
    [updateTask],
  );

  return useMutation(fn);
}
