import { useCallback, useEffect, useState } from 'react';
import type { UniqueId } from '@/shared/types';
import type { AchievementWithStatus } from '@/application/use-cases/gamification';
import { useAppDependencies } from '@/presentation/providers';

export function useAchievements(userId: UniqueId | undefined) {
  const { listAchievements } = useAppDependencies();
  const [achievements, setAchievements] = useState<AchievementWithStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await listAchievements.execute({ userId });
      setAchievements(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [userId, listAchievements]);

  useEffect(() => {
    load();
  }, [load]);

  return { achievements, loading, error, refetch: load };
}
