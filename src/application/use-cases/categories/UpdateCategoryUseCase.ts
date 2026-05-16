import { NotFoundError } from '@/shared/errors';
import type { UniqueId } from '@/shared/types';
import { updateCategory, type Category } from '@/domain/entities';
import type { CategoryRepository } from '@/domain/repositories';

export interface UpdateCategoryInput {
  id: UniqueId;
  name?: string;
  color?: string;
  icon?: string;
}

export class UpdateCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(input: UpdateCategoryInput): Promise<Category> {
    const existing = await this.categoryRepository.findById(input.id);
    if (!existing) throw new NotFoundError('Category', input.id);
    const updated = updateCategory(existing, {
      name: input.name,
      color: input.color,
      icon: input.icon,
    });
    await this.categoryRepository.save(updated);
    return updated;
  }
}
