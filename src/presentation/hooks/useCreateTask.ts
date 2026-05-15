import { useCallback } from 'react';
import type { CreateTaskInput } from '@/application/use-cases/tasks';
import type { Task } from '@/domain/entities';
import { useAppDependencies } from '@/presentation/providers';
import { useMutation } from './useMutation';

export function useCreateTask() {
  const { createTask } = useAppDependencies();

  const fn = useCallback(
    async (input: CreateTaskInput): Promise<Task> => {
      return createTask.execute(input);
    },
    [createTask],
  );

  return useMutation(fn);
}
