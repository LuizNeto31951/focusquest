import { NotFoundError } from '@/shared/errors';
import type { UniqueId } from '@/shared/types';
import { renameCategory, type Category } from '@/domain/entities';
import type { CategoryRepository } from '@/domain/repositories';

export interface RenameCategoryInput {
  id: UniqueId;
  newName: string;
}

export class RenameCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(input: RenameCategoryInput): Promise<Category> {
    const existing = await this.categoryRepository.findById(input.id);
    if (!existing) throw new NotFoundError('Category', input.id);

    const updated = renameCategory(existing, input.newName);
    await this.categoryRepository.save(updated);
    return updated;
  }
}
