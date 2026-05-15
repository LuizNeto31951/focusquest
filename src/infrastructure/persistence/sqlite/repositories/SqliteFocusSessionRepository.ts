import type { UniqueId, ISODate } from '@/shared/types';
import type { FocusSession } from '@/domain/entities';
import type { FocusSessionRepository } from '@/domain/repositories';
import type { SqliteClient } from '../SqliteClient';
import { FocusSessionMapper, type FocusSessionRow } from '../mappers';

export class SqliteFocusSessionRepository implements FocusSessionRepository {
  constructor(private readonly client: SqliteClient) {}

  async findById(id: UniqueId): Promise<FocusSession | null> {
    const row = await this.client.get<FocusSessionRow>(
      'SELECT * FROM focus_sessions WHERE id = ?',
      id,
    );
    return row ? FocusSessionMapper.toDomain(row) : null;
  }

  async findActiveByUser(userId: UniqueId): Promise<FocusSession | null> {
    const row = await this.client.get<FocusSessionRow>(
      `SELECT * FROM focus_sessions
       WHERE user_id = ? AND ended_at IS NULL
       ORDER BY started_at DESC
       LIMIT 1`,
      userId,
    );
    return row ? FocusSessionMapper.toDomain(row) : null;
  }

  async findByUserAndDay(
    userId: UniqueId,
    day: ISODate,
  ): Promise<FocusSession[]> {
    const rows = await this.client.getAll<FocusSessionRow>(
      `SELECT * FROM focus_sessions
       WHERE user_id = ? AND date(started_at) = date(?)
       ORDER BY started_at ASC`,
      userId,
      day,
    );
    return rows.map(FocusSessionMapper.toDomain);
  }

  async save(session: FocusSession): Promise<void> {
    const r = FocusSessionMapper.toRow(session);
    await this.client.run(
      `INSERT INTO focus_sessions (
        id, user_id, task_id, started_at, ended_at,
        planned_duration_minutes, was_interrupted, blocked_app_packages
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        task_id = excluded.task_id,
        ended_at = excluded.ended_at,
        was_interrupted = excluded.was_interrupted,
        blocked_app_packages = excluded.blocked_app_packages`,
      r.id,
      r.user_id,
      r.task_id,
      r.started_at,
      r.ended_at,
      r.planned_duration_minutes,
      r.was_interrupted,
      r.blocked_app_packages,
    );
  }
}
