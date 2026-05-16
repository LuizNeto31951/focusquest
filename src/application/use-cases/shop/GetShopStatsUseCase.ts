import { NotFoundError } from '@/shared/errors';
import type { UniqueId } from '@/shared/types';
import type {
  RewardRedemptionRepository,
  UserRepository,
} from '@/domain/repositories';

export interface ShopStats {
  readonly coins: number;
  readonly totalRedemptions: number;
  readonly totalSpent: number;
}

export interface GetShopStatsInput {
  userId: UniqueId;
}

export class GetShopStatsUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly redemptionRepository: RewardRedemptionRepository,
  ) {}

  async execute(input: GetShopStatsInput): Promise<ShopStats> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) throw new NotFoundError('User', input.userId);

    const [totalRedemptions, totalSpent] = await Promise.all([
      this.redemptionRepository.countByUser(input.userId),
      this.redemptionRepository.totalSpentByUser(input.userId),
    ]);

    return {
      coins: user.coins,
      totalRedemptions,
      totalSpent,
    };
  }
}
