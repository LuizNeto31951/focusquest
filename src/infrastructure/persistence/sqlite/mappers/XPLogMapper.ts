import { UniqueId, ISODate } from '@/shared/types';
import { XP } from '@/domain/value-objects';
import type { XPLog, XPSource } from '@/domain/entities';

export interface XPLogRow {
  id: string;
  user_id: string;
  source: string;
  amount: number;
  task_id: string | null;
  focus_session_id: string | null;
  achievement_code: string | null;
  created_at: string;
}

export const XPLogMapper = {
  toRow(entry: XPLog): XPLogRow {
    return {
      id: entry.id,
      user_id: entry.userId,
      source: entry.source,
      amount: entry.amount,
      task_id: entry.taskId ?? null,
      focus_session_id: entry.focusSessionId ?? null,
      achievement_code: entry.achievementCode ?? null,
      created_at: entry.createdAt,
    };
  },

  toDomain(row: XPLogRow): XPLog {
    return {
      id: UniqueId.from(row.id),
      userId: UniqueId.from(row.user_id),
      source: row.source as XPSource,
      amount: XP.from(row.amount),
      taskId: row.task_id ? UniqueId.from(row.task_id) : undefined,
      focusSessionId: row.focus_session_id
        ? UniqueId.from(row.focus_session_id)
        : undefined,
      achievementCode: row.achievement_code ?? undefined,
      createdAt: ISODate.from(row.created_at),
    };
  },
};
