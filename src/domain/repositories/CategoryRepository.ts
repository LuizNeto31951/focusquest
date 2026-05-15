import type { UniqueId } from '@/shared/types';
import type { Category } from '@/domain/entities';

export interface CategoryRepository {
  findAll(): Promise<Category[]>;
  findById(id: UniqueId): Promise<Category | null>;
  save(category: Category): Promise<void>;
  delete(id: UniqueId): Promise<void>;
}
