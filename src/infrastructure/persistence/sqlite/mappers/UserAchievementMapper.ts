import { UniqueId, ISODate } from '@/shared/types';
import type { UserAchievement } from '@/domain/entities';

export interface UserAchievementRow {
  user_id: string;
  achievement_code: string;
  unlocked_at: string;
}

export const UserAchievementMapper = {
  toRow(unlock: UserAchievement): UserAchievementRow {
    return {
      user_id: unlock.userId,
      achievement_code: unlock.achievementCode,
      unlocked_at: unlock.unlockedAt,
    };
  },

  toDomain(row: UserAchievementRow): UserAchievement {
    return {
      userId: UniqueId.from(row.user_id),
      achievementCode: row.achievement_code,
      unlockedAt: ISODate.from(row.unlocked_at),
    };
  },
};
