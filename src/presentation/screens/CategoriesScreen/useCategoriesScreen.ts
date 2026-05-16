import { useCallback } from 'react';
import type { UniqueId } from '@/shared/types';
import {
  useCategories,
  useDeleteCategory,
} from '@/presentation/hooks';

export function useCategoriesScreen() {
  const { categories, loading } = useCategories();
  const deleteCategory = useDeleteCategory();

  const remove = useCallback(
    async (id: UniqueId) => {
      await deleteCategory.run({ id });
    },
    [deleteCategory],
  );

  return {
    categories,
    loading,
    remove,
    removing: deleteCategory.loading,
  };
}
