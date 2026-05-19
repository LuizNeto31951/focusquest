import { ValidationError } from '@/shared/errors';
import type { UniqueId, ISODate } from '@/shared/types';
import { DurationMinutes } from '@/domain/value-objects';
import { minutesBetween } from '@/shared/utils/dates';

export interface FocusSession {
  readonly id: UniqueId;
  readonly userId: UniqueId;
  readonly taskId?: UniqueId;
  readonly startedAt: ISODate;
  readonly endedAt?: ISODate;
  readonly plannedDurationMinutes: DurationMinutes;
  readonly wasInterrupted: boolean;
  readonly blockedAppPackages: readonly string[];
  readonly pomodoroCycles?: number;
  readonly pomodoroBreakMinutes?: number;
}

export interface StartFocusSessionProps {
  id: UniqueId;
  userId: UniqueId;
  taskId?: UniqueId;
  plannedDurationMinutes: DurationMinutes;
  blockedAppPackages?: readonly string[];
  pomodoroCycles?: number;
  pomodoroBreakMinutes?: number;
  now: ISODate;
}

export function startFocusSession(props: StartFocusSessionProps): FocusSession {
  return {
    id: props.id,
    userId: props.userId,
    taskId: props.taskId,
    startedAt: props.now,
    plannedDurationMinutes: props.plannedDurationMinutes,
    wasInterrupted: false,
    blockedAppPackages: props.blockedAppPackages ?? [],
    pomodoroCycles: props.pomodoroCycles,
    pomodoroBreakMinutes: props.pomodoroBreakMinutes,
  };
}

export function endFocusSession(
  session: FocusSession,
  endedAt: ISODate,
  wasInterrupted: boolean,
): FocusSession {
  if (session.endedAt) {
    throw new ValidationError('FocusSession already ended');
  }
  return { ...session, endedAt, wasInterrupted };
}

export function isFocusSessionActive(session: FocusSession): boolean {
  return session.endedAt === undefined;
}

export function focusSessionDurationMinutes(session: FocusSession, now: ISODate): number {
  const end = session.endedAt ?? now;
  return minutesBetween(new Date(session.startedAt), new Date(end));
}

export function isFocusSessionCompletedSuccessfully(session: FocusSession): boolean {
  return session.endedAt !== undefined && !session.wasInterrupted;
}
