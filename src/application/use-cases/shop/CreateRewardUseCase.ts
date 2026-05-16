import { createReward, type Reward } from '@/domain/entities';
import type { RewardRepository } from '@/domain/repositories';
import type { Clock, IdGenerator } from '@/application/ports';

export interface CreateRewardInput {
  name: string;
  description?: string;
  iconKey: string;
  color: string;
  imageUri?: string;
  cost: number;
  category?: string;
}

export class CreateRewardUseCase {
  constructor(
    private readonly rewardRepository: RewardRepository,
    private readonly clock: Clock,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(input: CreateRewardInput): Promise<Reward> {
    const reward = createReward({
      id: this.idGenerator.next(),
      name: input.name,
      description: input.description,
      iconKey: input.iconKey,
      color: input.color,
      imageUri: input.imageUri,
      cost: input.cost,
      category: input.category,
      now: this.clock.now(),
    });
    await this.rewardRepository.save(reward);
    return reward;
  }
}
