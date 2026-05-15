import { NotFoundError } from '@/shared/errors';
import type { UniqueId } from '@/shared/types';
import { XP, type Level } from '@/domain/value-objects';
import type { UserRepository } from '@/domain/repositories';
import { LevelCalculator } from '@/domain/services';

export interface UserStats {
  readonly userId: UniqueId;
  readonly name: string;
  readonly totalXP: XP;
  readonly level: Level;
  readonly xpRemainingToNextLevel: XP;
  readonly progressInCurrentLevel: number;
  readonly currentStreakDays: number;
  readonly longestStreakDays: number;
}

export interface GetUserStatsInput {
  userId: UniqueId;
}

export class GetUserStatsUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: GetUserStatsInput): Promise<UserStats> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) throw new NotFoundError('User', input.userId);

    const level = LevelCalculator.levelFromTotalXP(user.totalXP);
    const xpRemainingToNextLevel = LevelCalculator.xpRemainingToNextLevel(user.totalXP);
    const progressInCurrentLevel = LevelCalculator.progressInCurrentLevel(user.totalXP);

    return {
      userId: user.id,
      name: user.name,
      totalXP: user.totalXP,
      level,
      xpRemainingToNextLevel,
      progressInCurrentLevel,
      currentStreakDays: user.streak.current,
      longestStreakDays: user.streak.longest,
    };
  }
}
