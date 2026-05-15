import type { Category } from '@/domain/entities';
import type { CategoryRepository } from '@/domain/repositories';

export class ListCategoriesUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }
}
