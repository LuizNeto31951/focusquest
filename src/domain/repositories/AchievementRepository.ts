import type { UniqueId } from '@/shared/types';
import type { Achievement, UserAchievement } from '@/domain/entities';

export interface AchievementRepository {
  findAll(): Promise<Achievement[]>;
  findByCode(code: string): Promise<Achievement | null>;

  findUnlockedByUser(userId: UniqueId): Promise<UserAchievement[]>;
  saveUnlock(unlock: UserAchievement): Promise<void>;
}
