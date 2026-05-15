import { UniqueId, ISODate } from '@/shared/types';
import type { TaskDailyCompletion } from '@/domain/entities';

export interface TaskDailyCompletionRow {
  task_id: string;
  day: string;
  completed_at: string;
}

export const TaskDailyCompletionMapper = {
  toRow(completion: TaskDailyCompletion): TaskDailyCompletionRow {
    return {
      task_id: completion.taskId,
      day: completion.day,
      completed_at: completion.completedAt,
    };
  },

  toDomain(row: TaskDailyCompletionRow): TaskDailyCompletion {
    return {
      taskId: UniqueId.from(row.task_id),
      day: row.day,
      completedAt: ISODate.from(row.completed_at),
    };
  },
};
