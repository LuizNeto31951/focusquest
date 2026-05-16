import { useCallback } from 'react';
import type { UpdateCategoryInput } from '@/application/use-cases/categories';
import type { Category } from '@/domain/entities';
import { useAppDependencies } from '@/presentation/providers';
import { useInvalidationStore } from '@/presentation/stores';
import { useMutation } from './useMutation';

export function useUpdateCategory() {
  const { updateCategory } = useAppDependencies();
  const bumpCategories = useInvalidationStore((s) => s.bumpCategories);
  const bumpTasks = useInvalidationStore((s) => s.bumpTasks);

  const fn = useCallback(
    async (input: UpdateCategoryInput): Promise<Category> => {
      const category = await updateCategory.execute(input);
      bumpCategories();
      bumpTasks();
      return category;
    },
    [updateCategory, bumpCategories, bumpTasks],
  );

  return useMutation(fn);
}
