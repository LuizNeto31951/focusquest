import { NotFoundError } from '@/shared/errors';
import type { UniqueId } from '@/shared/types';
import { updateReward, type Reward } from '@/domain/entities';
import type { RewardRepository } from '@/domain/repositories';
import type { Clock } from '@/application/ports';

export interface UpdateRewardInput {
  id: UniqueId;
  name?: string;
  description?: string;
  iconKey?: string;
  color?: string;
  imageUri?: string | null;
  cost?: number;
  category?: string;
  isFavorite?: boolean;
}

export class UpdateRewardUseCase {
  constructor(
    private readonly rewardRepository: RewardRepository,
    private readonly clock: Clock,
  ) {}

  async execute(input: UpdateRewardInput): Promise<Reward> {
    const existing = await this.rewardRepository.findById(input.id);
    if (!existing) throw new NotFoundError('Reward', input.id);

    const updated = updateReward(
      existing,
      {
        name: input.name,
        description: input.description,
        iconKey: input.iconKey,
        color: input.color,
        imageUri: input.imageUri,
        cost: input.cost,
        category: input.category,
        isFavorite: input.isFavorite,
      },
      this.clock.now(),
    );
    await this.rewardRepository.save(updated);
    return updated;
  }
}
