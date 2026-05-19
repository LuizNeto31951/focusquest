import { UniqueId, ISODate } from '@/shared/types';
import { DurationMinutes } from '@/domain/value-objects';
import type { FocusSession } from '@/domain/entities';

export interface FocusSessionRow {
  id: string;
  user_id: string;
  task_id: string | null;
  started_at: string;
  ended_at: string | null;
  planned_duration_minutes: number;
  was_interrupted: number;
  blocked_app_packages: string;
  pomodoro_cycles: number | null;
  pomodoro_break_minutes: number | null;
}

export const FocusSessionMapper = {
  toRow(session: FocusSession): FocusSessionRow {
    return {
      id: session.id,
      user_id: session.userId,
      task_id: session.taskId ?? null,
      started_at: session.startedAt,
      ended_at: session.endedAt ?? null,
      planned_duration_minutes: session.plannedDurationMinutes,
      was_interrupted: session.wasInterrupted ? 1 : 0,
      blocked_app_packages: JSON.stringify(session.blockedAppPackages),
      pomodoro_cycles: session.pomodoroCycles ?? null,
      pomodoro_break_minutes: session.pomodoroBreakMinutes ?? null,
    };
  },

  toDomain(row: FocusSessionRow): FocusSession {
    return {
      id: UniqueId.from(row.id),
      userId: UniqueId.from(row.user_id),
      taskId: row.task_id ? UniqueId.from(row.task_id) : undefined,
      startedAt: ISODate.from(row.started_at),
      endedAt: row.ended_at ? ISODate.from(row.ended_at) : undefined,
      plannedDurationMinutes: DurationMinutes.from(row.planned_duration_minutes),
      wasInterrupted: row.was_interrupted === 1,
      blockedAppPackages: JSON.parse(row.blocked_app_packages) as string[],
      pomodoroCycles: row.pomodoro_cycles ?? undefined,
      pomodoroBreakMinutes: row.pomodoro_break_minutes ?? undefined,
    };
  },
};
