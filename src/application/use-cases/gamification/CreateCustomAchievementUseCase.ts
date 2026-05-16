import { ValidationError } from '@/shared/errors';
import {
  coinRewardForRequirement,
  type Achievement,
  type AchievementRequirement,
} from '@/domain/entities';
import type { AchievementRepository } from '@/domain/repositories';
import type { IdGenerator } from '@/application/ports';

export interface CreateCustomAchievementInput {
  name: string;
  description: string;
  iconName: string;
  requirement: AchievementRequirement;
}

export class CreateCustomAchievementUseCase {
  constructor(
    private readonly achievementRepository: AchievementRepository,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(
    input: CreateCustomAchievementInput,
  ): Promise<Achievement> {
    const name = input.name.trim();
    if (name.length === 0) {
      throw new ValidationError('Nome da conquista é obrigatório');
    }
    validateRequirement(input.requirement);

    const achievement: Achievement = {
      code: `custom_${this.idGenerator.next()}`,
      name,
      description: input.description.trim(),
      iconName: input.iconName,
      requirement: input.requirement,
      isCustom: true,
      coinReward: coinRewardForRequirement(input.requirement),
    };
    await this.achievementRepository.save(achievement);
    return achievement;
  }
}

function validateRequirement(requirement: AchievementRequirement): void {
  switch (requirement.kind) {
    case 'TASKS_COMPLETED':
    case 'FOCUS_SESSIONS_IN_DAY':
      if (requirement.count < 1) {
        throw new ValidationError('Quantidade deve ser >= 1');
      }
      break;
    case 'STREAK':
      if (requirement.days < 1) {
        throw new ValidationError('Sequência deve ser >= 1 dia');
      }
      break;
    case 'UNINTERRUPTED_FOCUS_MINUTES':
      if (requirement.minutes < 1) {
        throw new ValidationError('Minutos deve ser >= 1');
      }
      break;
    case 'LEVEL_REACHED':
      if (requirement.level < 1) {
        throw new ValidationError('Nível deve ser >= 1');
      }
      break;
    case 'EARLY_BIRD':
      if (requirement.beforeHour < 0 || requirement.beforeHour > 23) {
        throw new ValidationError('Hora deve estar entre 0 e 23');
      }
      break;
  }
}
