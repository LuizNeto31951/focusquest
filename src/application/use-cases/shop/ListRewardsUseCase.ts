import type { Reward } from '@/domain/entities';
import type { RewardRepository } from '@/domain/repositories';

export class ListRewardsUseCase {
  constructor(private readonly rewardRepository: RewardRepository) {}

  async execute(): Promise<Reward[]> {
    return this.rewardRepository.findAll();
  }
}
