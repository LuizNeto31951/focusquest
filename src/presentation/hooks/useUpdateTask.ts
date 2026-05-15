import { useCallback } from 'react';
import type { UpdateTaskInput } from '@/application/use-cases/tasks';
import type { Task } from '@/domain/entities';
import { useAppDependencies } from '@/presentation/providers';
import { useTasksStore } from '@/presentation/stores';
import { useMutation } from './useMutation';

export function useUpdateTask() {
  const { updateTask } = useAppDependencies();
  const upsertTask = useTasksStore((s) => s.upsertTask);

  const fn = useCallback(
    async (input: UpdateTaskInput): Promise<Task> => {
      const task = await updateTask.execute(input);
      upsertTask(task);
      return task;
    },
    [updateTask, upsertTask],
  );

  return useMutation(fn);
}
