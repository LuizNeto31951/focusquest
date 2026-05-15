import { useCallback, useEffect, useState } from 'react';
import type { UniqueId } from '@/shared/types';
import type { ActivityCalendar } from '@/application/use-cases/stats';
import { useAppDependencies } from '@/presentation/providers';
import { useInvalidationStore } from '@/presentation/stores';

export function useActivityCalendar(userId: UniqueId | undefined) {
  const { getActivityCalendar } = useAppDependencies();
  const tasksVersion = useInvalidationStore((s) => s.tasksVersion);
  const [calendar, setCalendar] = useState<ActivityCalendar | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getActivityCalendar.execute({ userId });
      setCalendar(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [userId, getActivityCalendar]);

  useEffect(() => {
    load();
  }, [load, tasksVersion]);

  return { calendar, loading, error, refetch: load };
}
