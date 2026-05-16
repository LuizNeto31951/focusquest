import { NotFoundError, ValidationError } from '@/shared/errors';
import type { AchievementRepository } from '@/domain/repositories';

export interface DeleteCustomAchievementInput {
  code: string;
}

export class DeleteCustomAchievementUseCase {
  constructor(private readonly achievementRepository: AchievementRepository) {}

  async execute(input: DeleteCustomAchievementInput): Promise<void> {
    const existing = await this.achievementRepository.findByCode(input.code);
    if (!existing) throw new NotFoundError('Achievement', input.code);
    if (!existing.isCustom) {
      throw new ValidationError('Conquistas padrão não podem ser removidas');
    }
    await this.achievementRepository.deleteByCode(input.code);
  }
}
