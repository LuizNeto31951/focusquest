import type { UniqueId } from '@/shared/types';
import type { Achievement, UserAchievement } from '@/domain/entities';
import type { AchievementRepository } from '@/domain/repositories';
import type { SqliteClient } from '../SqliteClient';
import {
  AchievementMapper,
  UserAchievementMapper,
  type AchievementRow,
  type UserAchievementRow,
} from '../mappers';

export class SqliteAchievementRepository implements AchievementRepository {
  constructor(private readonly client: SqliteClient) {}

  async findAll(): Promise<Achievement[]> {
    const rows = await this.client.getAll<AchievementRow>(
      'SELECT * FROM achievements',
    );
    return rows.map(AchievementMapper.toDomain);
  }

  async findByCode(code: string): Promise<Achievement | null> {
    const row = await this.client.get<AchievementRow>(
      'SELECT * FROM achievements WHERE code = ?',
      code,
    );
    return row ? AchievementMapper.toDomain(row) : null;
  }

  async findUnlockedByUser(userId: UniqueId): Promise<UserAchievement[]> {
    const rows = await this.client.getAll<UserAchievementRow>(
      'SELECT * FROM user_achievements WHERE user_id = ? ORDER BY unlocked_at DESC',
      userId,
    );
    return rows.map(UserAchievementMapper.toDomain);
  }

  async saveUnlock(unlock: UserAchievement): Promise<void> {
    const r = UserAchievementMapper.toRow(unlock);
    await this.client.run(
      `INSERT INTO user_achievements (user_id, achievement_code, unlocked_at)
       VALUES (?, ?, ?)
       ON CONFLICT(user_id, achievement_code) DO NOTHING`,
      r.user_id,
      r.achievement_code,
      r.unlocked_at,
    );
  }
}
