import { NotFoundError } from '@/shared/errors';
import type { UniqueId } from '@/shared/types';
import { setStreak, type User } from '@/domain/entities';
import type { UserRepository } from '@/domain/repositories';
import { StreakCalculator } from '@/domain/services';
import type { Clock } from '@/application/ports';

export interface SkipDayInput {
  userId: UniqueId;
}

export class SkipDayUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly clock: Clock,
  ) {}

  async execute(input: SkipDayInput): Promise<User> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) throw new NotFoundError('User', input.userId);

    const now = this.clock.now();
    const updatedStreak = StreakCalculator.skipDay(user.streak, now);
    const updatedUser = setStreak(user, updatedStreak, now);

    await this.userRepository.save(updatedUser);
    return updatedUser;
  }
}
