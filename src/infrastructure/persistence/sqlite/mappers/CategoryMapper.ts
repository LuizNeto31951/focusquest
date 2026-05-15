import { UniqueId } from '@/shared/types';
import type { Category } from '@/domain/entities';

export interface CategoryRow {
  id: string;
  name: string;
  color: string;
  icon: string;
  is_default: number;
}

export const CategoryMapper = {
  toRow(category: Category): CategoryRow {
    return {
      id: category.id,
      name: category.name,
      color: category.color,
      icon: category.icon,
      is_default: category.isDefault ? 1 : 0,
    };
  },

  toDomain(row: CategoryRow): Category {
    return {
      id: UniqueId.from(row.id),
      name: row.name,
      color: row.color,
      icon: row.icon,
      isDefault: row.is_default === 1,
    };
  },
};
