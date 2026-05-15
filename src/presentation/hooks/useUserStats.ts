import { useCallback, useEffect, useState } from 'react';
import type { UniqueId } from '@/shared/types';
import { useAppDependencies } from '@/presentation/providers';
import { useUserStore } from '@/presentation/stores';

export function useUserStats(userId: UniqueId | undefined) {
  const { getUserStats } = useAppDependencies();
  const stats = useUserStore((s) => s.stats);
  const setStats = useUserStore((s) => s.setStats);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getUserStats.execute({ userId });
      setStats(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [userId, getUserStats, setStats]);

  useEffect(() => {
    load();
  }, [load]);

  return { stats, loading, error, refetch: load };
}
