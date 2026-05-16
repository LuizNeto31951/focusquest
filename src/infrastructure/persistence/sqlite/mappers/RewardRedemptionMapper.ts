import { UniqueId, ISODate } from '@/shared/types';
import type { RewardRedemption } from '@/domain/entities';

export interface RewardRedemptionRow {
  id: string;
  user_id: string;
  reward_id: string;
  reward_name: string;
  cost: number;
  redeemed_at: string;
  note: string | null;
}

export const RewardRedemptionMapper = {
  toRow(redemption: RewardRedemption): RewardRedemptionRow {
    return {
      id: redemption.id,
      user_id: redemption.userId,
      reward_id: redemption.rewardId,
      reward_name: redemption.rewardName,
      cost: redemption.cost,
      redeemed_at: redemption.redeemedAt,
      note: redemption.note ?? null,
    };
  },

  toDomain(row: RewardRedemptionRow): RewardRedemption {
    return {
      id: UniqueId.from(row.id),
      userId: UniqueId.from(row.user_id),
      rewardId: UniqueId.from(row.reward_id),
      rewardName: row.reward_name,
      cost: row.cost,
      redeemedAt: ISODate.from(row.redeemed_at),
      note: row.note ?? undefined,
    };
  },
};
