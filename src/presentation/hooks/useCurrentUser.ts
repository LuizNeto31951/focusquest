import { useCallback, useEffect, useState } from 'react';
import { useAppDependencies } from '@/presentation/providers';
import { useUserStore } from '@/presentation/stores';

export function useCurrentUser(defaultName = 'Você') {
  const { ensureCurrentUser } = useAppDependencies();
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const [loading, setLoading] = useState(user === null);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const loaded = await ensureCurrentUser.execute({ defaultName });
      setUser(loaded);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [ensureCurrentUser, defaultName, setUser]);

  useEffect(() => {
    if (!user) load();
  }, [user, load]);

  return { user, loading, error, refetch: load };
}
