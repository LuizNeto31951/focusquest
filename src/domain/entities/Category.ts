import { ValidationError } from '@/shared/errors';
import type { UniqueId } from '@/shared/types';

export interface Category {
  readonly id: UniqueId;
  readonly name: string;
  readonly color: string;
  readonly icon: string;
  readonly isDefault: boolean;
}

export interface CreateCategoryProps {
  id: UniqueId;
  name: string;
  color: string;
  icon: string;
  isDefault?: boolean;
}

export function createCategory(props: CreateCategoryProps): Category {
  const name = props.name.trim();
  if (name.length === 0) {
    throw new ValidationError('Category name cannot be empty');
  }
  return {
    id: props.id,
    name,
    color: props.color,
    icon: props.icon,
    isDefault: props.isDefault ?? false,
  };
}

export interface UpdateCategoryProps {
  name?: string;
  color?: string;
  icon?: string;
}

export function updateCategory(
  category: Category,
  props: UpdateCategoryProps,
): Category {
  let name = category.name;
  if (props.name !== undefined) {
    const trimmed = props.name.trim();
    if (trimmed.length === 0) {
      throw new ValidationError('Category name cannot be empty');
    }
    name = trimmed;
  }
  return {
    ...category,
    name,
    color: props.color ?? category.color,
    icon: props.icon ?? category.icon,
  };
}
