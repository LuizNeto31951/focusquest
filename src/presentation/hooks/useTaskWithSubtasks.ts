import { useCallback, useEffect, useState } from 'react';
import type { UniqueId } from '@/shared/types';
import type { TaskWithSubtasks } from '@/application/use-cases/tasks';
import { useAppDependencies } from '@/presentation/providers';
import { useInvalidationStore } from '@/presentation/stores';

export function useTaskWithSubtasks(id: UniqueId | undefined) {
  const { getTaskWithSubtasks } = useAppDependencies();
  const tasksVersion = useInvalidationStore((s) => s.tasksVersion);
  const [data, setData] = useState<TaskWithSubtasks | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getTaskWithSubtasks.execute({ id });
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [id, getTaskWithSubtasks]);

  useEffect(() => {
    load();
  }, [load, tasksVersion]);

  return { data, loading, error, refetch: load };
}
