import type { UniqueId, ISODate } from '@/shared/types';

export interface RewardRedemption {
  readonly id: UniqueId;
  readonly userId: UniqueId;
  readonly rewardId: UniqueId;
  readonly rewardName: string;
  readonly cost: number;
  readonly redeemedAt: ISODate;
  readonly note?: string;
}

export interface CreateRewardRedemptionProps {
  id: UniqueId;
  userId: UniqueId;
  rewardId: UniqueId;
  rewardName: string;
  cost: number;
  now: ISODate;
  note?: string;
}

export function createRewardRedemption(
  props: CreateRewardRedemptionProps,
): RewardRedemption {
  return {
    id: props.id,
    userId: props.userId,
    rewardId: props.rewardId,
    rewardName: props.rewardName,
    cost: Math.max(0, Math.floor(props.cost)),
    redeemedAt: props.now,
    note: props.note?.trim() || undefined,
  };
}
