import { useCallback, useEffect, useState } from 'react';
import type { UniqueId } from '@/shared/types';
import { useAppDependencies } from '@/presentation/providers';
import { useFocusStore } from '@/presentation/stores';

export function useActiveFocusSession(userId: UniqueId | undefined) {
  const { getActiveFocusSession } = useAppDependencies();
  const activeSession = useFocusStore((s) => s.activeSession);
  const setActiveSession = useFocusStore((s) => s.setActiveSession);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getActiveFocusSession.execute({ userId });
      setActiveSession(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [userId, getActiveFocusSession, setActiveSession]);

  useEffect(() => {
    load();
  }, [load]);

  return { activeSession, loading, error, refetch: load };
}
