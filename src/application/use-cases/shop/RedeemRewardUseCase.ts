import { NotFoundError, ValidationError } from '@/shared/errors';
import type { UniqueId } from '@/shared/types';
import {
  createRewardRedemption,
  spendCoins,
  type Reward,
  type RewardRedemption,
  type User,
} from '@/domain/entities';
import type {
  RewardRepository,
  RewardRedemptionRepository,
  UserRepository,
} from '@/domain/repositories';
import type { Clock, IdGenerator } from '@/application/ports';

export interface RedeemRewardInput {
  userId: UniqueId;
  rewardId: UniqueId;
  note?: string;
}

export interface RedeemRewardOutput {
  readonly user: User;
  readonly reward: Reward;
  readonly redemption: RewardRedemption;
}

export class RedeemRewardUseCase {
  constructor(
    private readonly rewardRepository: RewardRepository,
    private readonly redemptionRepository: RewardRedemptionRepository,
    private readonly userRepository: UserRepository,
    private readonly clock: Clock,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(input: RedeemRewardInput): Promise<RedeemRewardOutput> {
    const reward = await this.rewardRepository.findById(input.rewardId);
    if (!reward) throw new NotFoundError('Reward', input.rewardId);

    const user = await this.userRepository.findById(input.userId);
    if (!user) throw new NotFoundError('User', input.userId);

    if (user.coins < reward.cost) {
      throw new ValidationError(
        `Saldo insuficiente. Você tem ${user.coins} moedas e precisa de ${reward.cost}.`,
      );
    }

    const now = this.clock.now();
    const updatedUser = spendCoins(user, reward.cost, now);
    const redemption = createRewardRedemption({
      id: this.idGenerator.next(),
      userId: user.id,
      rewardId: reward.id,
      rewardName: reward.name,
      cost: reward.cost,
      now,
      note: input.note,
    });

    await this.userRepository.save(updatedUser);
    await this.redemptionRepository.save(redemption);

    return { user: updatedUser, reward, redemption };
  }
}
