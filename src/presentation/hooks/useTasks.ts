import { useCallback, useEffect, useState } from 'react';
import type { ListTasksInput } from '@/application/use-cases/tasks';
import { useAppDependencies } from '@/presentation/providers';
import { useTasksStore } from '@/presentation/stores';

export function useTasks(input: ListTasksInput) {
  const { listTasks } = useAppDependencies();
  const tasks = useTasksStore((s) => s.tasks);
  const setTasks = useTasksStore((s) => s.setTasks);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const inputKey = JSON.stringify(input);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listTasks.execute(input);
      setTasks(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputKey, listTasks, setTasks]);

  useEffect(() => {
    load();
  }, [load]);

  return { tasks, loading, error, refetch: load };
}
