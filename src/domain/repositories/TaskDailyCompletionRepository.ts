import type { UniqueId } from '@/shared/types';
import type { TaskDailyCompletion } from '@/domain/entities';

export interface TaskDailyCompletionRepository {
  findByTaskAndDay(
    taskId: UniqueId,
    day: string,
  ): Promise<TaskDailyCompletion | null>;

  findByDay(userId: UniqueId, day: string): Promise<TaskDailyCompletion[]>;

  save(completion: TaskDailyCompletion): Promise<void>;

  deleteByTaskAndDay(taskId: UniqueId, day: string): Promise<void>;
}
