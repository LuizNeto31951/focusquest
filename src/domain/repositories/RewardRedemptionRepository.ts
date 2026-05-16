import type { UniqueId } from '@/shared/types';
import type { RewardRedemption } from '@/domain/entities';

export interface RewardRedemptionRepository {
  findByUser(userId: UniqueId, limit?: number): Promise<RewardRedemption[]>;
  countByUser(userId: UniqueId): Promise<number>;
  totalSpentByUser(userId: UniqueId): Promise<number>;
  save(redemption: RewardRedemption): Promise<void>;
  deleteById(id: UniqueId): Promise<void>;
}
