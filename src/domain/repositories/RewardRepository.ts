import type { UniqueId } from '@/shared/types';
import type { Reward } from '@/domain/entities';

export interface RewardRepository {
  findAll(): Promise<Reward[]>;
  findById(id: UniqueId): Promise<Reward | null>;
  save(reward: Reward): Promise<void>;
  delete(id: UniqueId): Promise<void>;
}
