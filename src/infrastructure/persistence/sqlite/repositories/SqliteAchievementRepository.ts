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

  async save(achievement: Achievement): Promise<void> {
    const r = AchievementMapper.toRow(achievement);
    await this.client.run(
      `INSERT INTO achievements (code, name, description, icon_name, requirement, is_custom)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(code) DO UPDATE SET
         name = excluded.name,
         description = excluded.description,
         icon_name = excluded.icon_name,
         requirement = excluded.requirement,
         is_custom = excluded.is_custom`,
      r.code,
      r.name,
      r.description,
      r.icon_name,
      r.requirement,
      r.is_custom,
    );
  }

  async deleteByCode(code: string): Promise<void> {
    await this.client.run('DELETE FROM achievements WHERE code = ?', code);
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
