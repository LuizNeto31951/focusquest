import type { UniqueId, ISODate } from '@/shared/types';
import type { Achievement } from '@/domain/entities';
import type { AchievementRepository } from '@/domain/repositories';

export interface AchievementWithStatus {
  readonly achievement: Achievement;
  readonly unlockedAt?: ISODate;
}

export interface ListAchievementsInput {
  userId: UniqueId;
}

export class ListAchievementsUseCase {
  constructor(private readonly achievementRepository: AchievementRepository) {}

  async execute(
    input: ListAchievementsInput,
  ): Promise<AchievementWithStatus[]> {
    const [all, unlocked] = await Promise.all([
      this.achievementRepository.findAll(),
      this.achievementRepository.findUnlockedByUser(input.userId),
    ]);

    const unlockedByCode = new Map(
      unlocked.map((u) => [u.achievementCode, u.unlockedAt]),
    );

    return all.map((achievement) => ({
      achievement,
      unlockedAt: unlockedByCode.get(achievement.code),
    }));
  }
}
