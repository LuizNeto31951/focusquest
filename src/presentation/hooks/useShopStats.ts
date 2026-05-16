import { useCallback, useEffect, useState } from 'react';
import type { UniqueId } from '@/shared/types';
import type { ShopStats } from '@/application/use-cases/shop';
import { useAppDependencies } from '@/presentation/providers';
import { useInvalidationStore } from '@/presentation/stores';

export function useShopStats(userId: UniqueId | undefined) {
  const { getShopStats } = useAppDependencies();
  const redemptionsVersion = useInvalidationStore((s) => s.redemptionsVersion);
  const tasksVersion = useInvalidationStore((s) => s.tasksVersion);
  const [stats, setStats] = useState<ShopStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getShopStats.execute({ userId });
      setStats(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [userId, getShopStats]);

  useEffect(() => {
    load();
  }, [load, redemptionsVersion, tasksVersion]);

  return { stats, loading, error, refetch: load };
}
