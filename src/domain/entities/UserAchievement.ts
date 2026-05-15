import type { UniqueId, ISODate } from '@/shared/types';

export interface UserAchievement {
  readonly userId: UniqueId;
  readonly achievementCode: string;
  readonly unlockedAt: ISODate;
}

export function unlockAchievement(
  userId: UniqueId,
  achievementCode: string,
  unlockedAt: ISODate,
): UserAchievement {
  return { userId, achievementCode, unlockedAt };
}
