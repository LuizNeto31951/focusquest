import { NotFoundError, ValidationError } from '@/shared/errors';
import type { UniqueId } from '@/shared/types';
import type { CategoryRepository } from '@/domain/repositories';

export interface DeleteCategoryInput {
  id: UniqueId;
}

export class DeleteCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(input: DeleteCategoryInput): Promise<void> {
    const existing = await this.categoryRepository.findById(input.id);
    if (!existing) throw new NotFoundError('Category', input.id);
    if (existing.isDefault) {
      throw new ValidationError('Default categories cannot be deleted');
    }
    await this.categoryRepository.delete(input.id);
  }
}
