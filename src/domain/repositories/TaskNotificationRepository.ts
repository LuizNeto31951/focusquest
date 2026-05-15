import type { UniqueId } from '@/shared/types';

export interface TaskNotificationLink {
  readonly taskId: UniqueId;
  readonly notificationId: string;
}

export interface TaskNotificationRepository {
  findByTask(taskId: UniqueId): Promise<TaskNotificationLink[]>;
  save(link: TaskNotificationLink): Promise<void>;
  deleteByTask(taskId: UniqueId): Promise<void>;
}
