import { NotFoundError } from '@/shared/errors';
import type { UniqueId } from '@/shared/types';
import { completeOnboarding, type User } from '@/domain/entities';
import type { UserRepository } from '@/domain/repositories';
import type { Clock } from '@/application/ports';

export interface CompleteOnboardingInput {
  userId: UniqueId;
}

export class CompleteOnboardingUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly clock: Clock,
  ) {}

  async execute(input: CompleteOnboardingInput): Promise<User> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) throw new NotFoundError('User', input.userId);
    if (user.onboardingCompletedAt) return user;
    const updated = completeOnboarding(user, this.clock.now());
    await this.userRepository.save(updated);
    return updated;
  }
}
