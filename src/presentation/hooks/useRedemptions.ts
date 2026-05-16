import { useCallback, useEffect, useState } from 'react';
import type { UniqueId } from '@/shared/types';
import type { RewardRedemption } from '@/domain/entities';
import { useAppDependencies } from '@/presentation/providers';
import { useInvalidationStore } from '@/presentation/stores';

export function useRedemptions(userId: UniqueId | undefined, limit = 50) {
  const { listRedemptions } = useAppDependencies();
  const redemptionsVersion = useInvalidationStore((s) => s.redemptionsVersion);
  const [redemptions, setRedemptions] = useState<RewardRedemption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await listRedemptions.execute({ userId, limit });
      setRedemptions(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [userId, limit, listRedemptions]);

  useEffect(() => {
    load();
  }, [load, redemptionsVersion]);

  return { redemptions, loading, error, refetch: load };
}
