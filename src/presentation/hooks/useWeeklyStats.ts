import { useCallback, useEffect, useState } from 'react';
import type { UniqueId } from '@/shared/types';
import type { WeeklyStats } from '@/application/use-cases/stats';
import { useAppDependencies } from '@/presentation/providers';
import { useInvalidationStore, useUserStore } from '@/presentation/stores';

export function useWeeklyStats(userId: UniqueId | undefined) {
  const { getWeeklyStats } = useAppDependencies();
  const tasksVersion = useInvalidationStore((s) => s.tasksVersion);
  const userTotalXP = useUserStore((s) => s.user?.totalXP);
  const [stats, setStats] = useState<WeeklyStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getWeeklyStats.execute({ userId });
      setStats(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [userId, getWeeklyStats]);

  useEffect(() => {
    load();
  }, [load, tasksVersion, userTotalXP]);

  return { stats, loading, error, refetch: load };
}
