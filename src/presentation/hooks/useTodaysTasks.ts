import { useCallback, useEffect, useState } from 'react';
import type { UniqueId, ISODate } from '@/shared/types';
import type { TaskForDay } from '@/application/use-cases/tasks';
import { useAppDependencies } from '@/presentation/providers';
import { useInvalidationStore } from '@/presentation/stores';

export function useTodaysTasks(
  userId: UniqueId | undefined,
  day: ISODate,
  enabled = true,
) {
  const { listTodaysTasks } = useAppDependencies();
  const tasksVersion = useInvalidationStore((s) => s.tasksVersion);
  const [tasks, setTasks] = useState<TaskForDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    if (!enabled || !userId) {
      setTasks([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await listTodaysTasks.execute({ userId, day });
      setTasks(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [enabled, userId, day, listTodaysTasks]);

  useEffect(() => {
    load();
  }, [load, tasksVersion]);

  return { tasks, loading, error, refetch: load };
}
