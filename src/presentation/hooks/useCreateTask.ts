import { useCallback } from 'react';
import type { CreateTaskInput } from '@/application/use-cases/tasks';
import type { Task } from '@/domain/entities';
import { useAppDependencies } from '@/presentation/providers';
import { useTasksStore } from '@/presentation/stores';
import { useMutation } from './useMutation';

export function useCreateTask() {
  const { createTask } = useAppDependencies();
  const upsertTask = useTasksStore((s) => s.upsertTask);

  const fn = useCallback(
    async (input: CreateTaskInput): Promise<Task> => {
      const task = await createTask.execute(input);
      upsertTask(task);
      return task;
    },
    [createTask, upsertTask],
  );

  return useMutation(fn);
}
