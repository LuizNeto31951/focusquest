import { useCallback, useEffect, useState } from 'react';
import { UniqueId } from '@/shared/types';
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
} from '@/presentation/hooks';
import { CATEGORY_COLORS } from './CategoryEditorAssets';
import { CATEGORY_ICON_OPTIONS } from '@/presentation/components';

export function useCategoryEditorScreen(categoryIdParam?: string) {
  const categoryId = categoryIdParam ? UniqueId.from(categoryIdParam) : undefined;
  const isEdit = Boolean(categoryId);
  const { categories } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const existing = isEdit ? categories.find((c) => c.id === categoryId) : undefined;

  const [name, setName] = useState('');
  const [color, setColor] = useState(CATEGORY_COLORS[0]!);
  const [icon, setIcon] = useState<string>(CATEGORY_ICON_OPTIONS[0]!);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    if (existing) {
      setName(existing.name);
      setColor(existing.color);
      setIcon(existing.icon);
    }
  }, [existing]);

  const nameError = submitAttempted && !name.trim() ? 'Nome obrigatório' : undefined;
  const isValid = name.trim().length > 0;

  const submit = useCallback(async () => {
    setSubmitAttempted(true);
    if (!isValid) {
      throw new Error('Nome obrigatório');
    }
    if (isEdit && categoryId) {
      await updateCategory.run({ id: categoryId, name, color, icon });
    } else {
      await createCategory.run({ name, color, icon });
    }
  }, [isEdit, isValid, categoryId, name, color, icon, createCategory, updateCategory]);

  return {
    isEdit,
    existing,
    name,
    setName,
    color,
    setColor,
    icon,
    setIcon,
    nameError,
    isValid,
    submitAttempted,
    submit,
    submitting: createCategory.loading || updateCategory.loading,
    submitError: createCategory.error ?? updateCategory.error,
  };
}
