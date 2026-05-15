import { useCallback, useEffect, useState } from 'react';
import type { Category } from '@/domain/entities';
import { useAppDependencies } from '@/presentation/providers';
import { useInvalidationStore } from '@/presentation/stores';

export function useCategories() {
  const { listCategories } = useAppDependencies();
  const categoriesVersion = useInvalidationStore((s) => s.categoriesVersion);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listCategories.execute();
      setCategories(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [listCategories]);

  useEffect(() => {
    load();
  }, [load, categoriesVersion]);

  return { categories, loading, error, refetch: load };
}
