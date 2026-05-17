import type { UniqueId } from '@/shared/types';
import type { UserPreferences } from '@/domain/entities';
import type { UserPreferencesRepository } from '@/domain/repositories';
import type { SqliteClient } from '../SqliteClient';
import { UserPreferencesMapper, type UserPreferencesRow } from '../mappers';

export class SqliteUserPreferencesRepository
  implements UserPreferencesRepository
{
  constructor(private readonly client: SqliteClient) {}

  async findByUser(userId: UniqueId): Promise<UserPreferences | null> {
    const row = await this.client.get<UserPreferencesRow>(
      'SELECT * FROM user_preferences WHERE user_id = ?',
      userId,
    );
    return row ? UserPreferencesMapper.toDomain(row) : null;
  }

  async save(preferences: UserPreferences): Promise<void> {
    const r = UserPreferencesMapper.toRow(preferences);
    await this.client.run(
      `INSERT INTO user_preferences (
        user_id, mode, accent, font_scale, density, reduce_motion, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET
        mode = excluded.mode,
        accent = excluded.accent,
        font_scale = excluded.font_scale,
        density = excluded.density,
        reduce_motion = excluded.reduce_motion,
        updated_at = excluded.updated_at`,
      r.user_id,
      r.mode,
      r.accent,
      r.font_scale,
      r.density,
      r.reduce_motion,
      r.updated_at,
    );
  }
}
