import { useCallback } from 'react';
import type { CreateCategoryInput } from '@/application/use-cases/categories';
import type { Category } from '@/domain/entities';
import { useAppDependencies } from '@/presentation/providers';
import { useInvalidationStore } from '@/presentation/stores';
import { useMutation } from './useMutation';

export function useCreateCategory() {
  const { createCategory } = useAppDependencies();
  const bumpCategories = useInvalidationStore((s) => s.bumpCategories);

  const fn = useCallback(
    async (input: CreateCategoryInput): Promise<Category> => {
      const category = await createCategory.execute(input);
      bumpCategories();
      return category;
    },
    [createCategory, bumpCategories],
  );

  return useMutation(fn);
}
