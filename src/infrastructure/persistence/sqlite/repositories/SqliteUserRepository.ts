import type { UniqueId } from '@/shared/types';
import type { User } from '@/domain/entities';
import type { UserRepository } from '@/domain/repositories';
import type { SqliteClient } from '../SqliteClient';
import { UserMapper, type UserRow } from '../mappers';

export class SqliteUserRepository implements UserRepository {
  constructor(private readonly client: SqliteClient) {}

  async findById(id: UniqueId): Promise<User | null> {
    const row = await this.client.get<UserRow>(
      'SELECT * FROM users WHERE id = ?',
      id,
    );
    return row ? UserMapper.toDomain(row) : null;
  }

  async findCurrent(): Promise<User | null> {
    const row = await this.client.get<UserRow>(
      'SELECT * FROM users ORDER BY created_at ASC LIMIT 1',
    );
    return row ? UserMapper.toDomain(row) : null;
  }

  async save(user: User): Promise<void> {
    const r = UserMapper.toRow(user);
    await this.client.run(
      `INSERT INTO users (
        id, name, total_xp,
        streak_current, streak_longest, streak_last_active_date,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        total_xp = excluded.total_xp,
        streak_current = excluded.streak_current,
        streak_longest = excluded.streak_longest,
        streak_last_active_date = excluded.streak_last_active_date,
        updated_at = excluded.updated_at`,
      r.id,
      r.name,
      r.total_xp,
      r.streak_current,
      r.streak_longest,
      r.streak_last_active_date,
      r.created_at,
      r.updated_at,
    );
  }
}
