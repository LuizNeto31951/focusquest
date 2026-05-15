import type { UniqueId, ISODate } from '@/shared/types';

export interface TaskDailyCompletion {
  readonly taskId: UniqueId;
  readonly day: string;
  readonly completedAt: ISODate;
}

export function recordDailyCompletion(
  taskId: UniqueId,
  day: string,
  completedAt: ISODate,
): TaskDailyCompletion {
  return { taskId, day, completedAt };
}

export function dayKeyFromISODate(iso: ISODate): string {
  return iso.slice(0, 10);
}
