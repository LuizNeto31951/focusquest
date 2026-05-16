import { useCallback, useEffect, useState } from 'react';
import type { Reward } from '@/domain/entities';
import { useAppDependencies } from '@/presentation/providers';
import { useInvalidationStore } from '@/presentation/stores';

export function useRewards() {
  const { listRewards } = useAppDependencies();
  const rewardsVersion = useInvalidationStore((s) => s.rewardsVersion);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listRewards.execute();
      setRewards(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [listRewards]);

  useEffect(() => {
    load();
  }, [load, rewardsVersion]);

  return { rewards, loading, error, refetch: load };
}
