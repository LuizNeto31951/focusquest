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

export function renameCategory(category: Category, newName: string): Category {
  if (category.isDefault) {
    throw new ValidationError('Default categories cannot be renamed');
  }
  const name = newName.trim();
  if (name.length === 0) {
    throw new ValidationError('Category name cannot be empty');
  }
  return { ...category, name };
}
