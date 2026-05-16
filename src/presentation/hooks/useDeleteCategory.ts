import { useCallback } from 'react';
import type { DeleteCategoryInput } from '@/application/use-cases/categories';
import { useAppDependencies } from '@/presentation/providers';
import { useInvalidationStore } from '@/presentation/stores';
import { useMutation } from './useMutation';

export function useDeleteCategory() {
  const { deleteCategory } = useAppDependencies();
  const bumpCategories = useInvalidationStore((s) => s.bumpCategories);

  const fn = useCallback(
    async (input: DeleteCategoryInput): Promise<void> => {
      await deleteCategory.execute(input);
      bumpCategories();
    },
    [deleteCategory, bumpCategories],
  );

  return useMutation(fn);
}
