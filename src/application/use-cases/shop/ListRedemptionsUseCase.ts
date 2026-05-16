import type { UniqueId } from '@/shared/types';
import type { RewardRedemption } from '@/domain/entities';
import type { RewardRedemptionRepository } from '@/domain/repositories';

export interface ListRedemptionsInput {
  userId: UniqueId;
  limit?: number;
}

export class ListRedemptionsUseCase {
  constructor(
    private readonly redemptionRepository: RewardRedemptionRepository,
  ) {}

  async execute(input: ListRedemptionsInput): Promise<RewardRedemption[]> {
    return this.redemptionRepository.findByUser(input.userId, input.limit);
  }
}
