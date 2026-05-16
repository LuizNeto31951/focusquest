import type { UniqueId } from '@/shared/types';
import type { Achievement, UserAchievement } from '@/domain/entities';

export interface AchievementRepository {
  findAll(): Promise<Achievement[]>;
  findByCode(code: string): Promise<Achievement | null>;

  save(achievement: Achievement): Promise<void>;
  deleteByCode(code: string): Promise<void>;

  findUnlockedByUser(userId: UniqueId): Promise<UserAchievement[]>;
  saveUnlock(unlock: UserAchievement): Promise<void>;
}
