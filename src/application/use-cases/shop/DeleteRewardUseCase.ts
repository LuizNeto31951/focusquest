import { NotFoundError } from '@/shared/errors';
import type { UniqueId } from '@/shared/types';
import type { RewardRepository } from '@/domain/repositories';

export interface DeleteRewardInput {
  id: UniqueId;
}

export class DeleteRewardUseCase {
  constructor(private readonly rewardRepository: RewardRepository) {}

  async execute(input: DeleteRewardInput): Promise<void> {
    const existing = await this.rewardRepository.findById(input.id);
    if (!existing) throw new NotFoundError('Reward', input.id);
    await this.rewardRepository.delete(input.id);
  }
}
