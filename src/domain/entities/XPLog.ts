import type { UniqueId, ISODate } from '@/shared/types';
import type { XP } from '@/domain/value-objects';

export type XPSource =
  | 'TASK_COMPLETION'
  | 'SUBTASK_COMPLETION'
  | 'FOCUS_SESSION'
  | 'STREAK_BONUS'
  | 'EARLY_COMPLETION_BONUS'
  | 'ACHIEVEMENT_UNLOCK';

export interface XPLog {
  readonly id: UniqueId;
  readonly userId: UniqueId;
  readonly source: XPSource;
  readonly amount: XP;
  readonly taskId?: UniqueId;
  readonly focusSessionId?: UniqueId;
  readonly achievementCode?: string;
  readonly createdAt: ISODate;
}

export interface CreateXPLogProps {
  id: UniqueId;
  userId: UniqueId;
  source: XPSource;
  amount: XP;
  taskId?: UniqueId;
  focusSessionId?: UniqueId;
  achievementCode?: string;
  now: ISODate;
}

export function createXPLog(props: CreateXPLogProps): XPLog {
  return {
    id: props.id,
    userId: props.userId,
    source: props.source,
    amount: props.amount,
    taskId: props.taskId,
    focusSessionId: props.focusSessionId,
    achievementCode: props.achievementCode,
    createdAt: props.now,
  };
}
