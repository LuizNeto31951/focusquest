import { createCategory, type Category } from '@/domain/entities';
import type { CategoryRepository } from '@/domain/repositories';
import type { IdGenerator } from '@/application/ports';

export interface CreateCategoryInput {
  name: string;
  color: string;
  icon: string;
}

export class CreateCategoryUseCase {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(input: CreateCategoryInput): Promise<Category> {
    const category = createCategory({
      id: this.idGenerator.next(),
      name: input.name,
      color: input.color,
      icon: input.icon,
      isDefault: false,
    });
    await this.categoryRepository.save(category);
    return category;
  }
}
