import { useCallback } from 'react';
import type { CreateTaskInput } from '@/application/use-cases/tasks';
import type { Task } from '@/domain/entities';
import { useAppDependencies } from '@/presentation/providers';
import { useInvalidationStore } from '@/presentation/stores';
import { useMutation } from './useMutation';

export function useCreateTask() {
  const { createTask } = useAppDependencies();
  const bumpTasks = useInvalidationStore((s) => s.bumpTasks);

  const fn = useCallback(
    async (input: CreateTaskInput): Promise<Task> => {
      const task = await createTask.execute(input);
      bumpTasks();
      return task;
    },
    [createTask, bumpTasks],
  );

  return useMutation(fn);
}
