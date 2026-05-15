import { useCallback } from 'react';
import type { UpdateTaskInput } from '@/application/use-cases/tasks';
import type { Task } from '@/domain/entities';
import { useAppDependencies } from '@/presentation/providers';
import { useInvalidationStore } from '@/presentation/stores';
import { useMutation } from './useMutation';

export function useUpdateTask() {
  const { updateTask } = useAppDependencies();
  const bumpTasks = useInvalidationStore((s) => s.bumpTasks);

  const fn = useCallback(
    async (input: UpdateTaskInput): Promise<Task> => {
      const task = await updateTask.execute(input);
      bumpTasks();
      return task;
    },
    [updateTask, bumpTasks],
  );

  return useMutation(fn);
}
