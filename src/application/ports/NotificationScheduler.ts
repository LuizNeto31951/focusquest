import type { UniqueId } from '@/shared/types';
import type { Task } from '@/domain/entities';

export interface NotificationScheduler {
  requestPermissions(): Promise<boolean>;
  scheduleForTask(task: Task): Promise<void>;
  cancelForTask(taskId: UniqueId): Promise<void>;
}
