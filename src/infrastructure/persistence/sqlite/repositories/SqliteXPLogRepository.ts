import type { UniqueId, ISODate } from '@/shared/types';
import type { XPLog } from '@/domain/entities';
import type { XPLogRepository } from '@/domain/repositories';
import type { SqliteClient } from '../SqliteClient';
import { XPLogMapper, type XPLogRow } from '../mappers';

const DEFAULT_LIMIT = 100;

export class SqliteXPLogRepository implements XPLogRepository {
  constructor(private readonly client: SqliteClient) {}

  async save(entry: XPLog): Promise<void> {
    const r = XPLogMapper.toRow(entry);
    await this.client.run(
      `INSERT INTO xp_logs (
        id, user_id, source, amount,
        task_id, focus_session_id, achievement_code, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      r.id,
      r.user_id,
      r.source,
      r.amount,
      r.task_id,
      r.focus_session_id,
      r.achievement_code,
      r.created_at,
    );
  }

  async findByUser(userId: UniqueId, limit = DEFAULT_LIMIT): Promise<XPLog[]> {
    const rows = await this.client.getAll<XPLogRow>(
      `SELECT * FROM xp_logs
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT ?`,
      userId,
      limit,
    );
    return rows.map(XPLogMapper.toDomain);
  }

  async findByUserSince(userId: UniqueId, since: ISODate): Promise<XPLog[]> {
    const rows = await this.client.getAll<XPLogRow>(
      `SELECT * FROM xp_logs
       WHERE user_id = ? AND created_at >= ?
       ORDER BY created_at ASC`,
      userId,
      since,
    );
    return rows.map(XPLogMapper.toDomain);
  }
}
