import { UniqueId } from '@/shared/types';
import type {
  TaskNotificationLink,
  TaskNotificationRepository,
} from '@/domain/repositories';
import type { SqliteClient } from '../SqliteClient';

interface TaskNotificationRow {
  task_id: string;
  notification_id: string;
}

export class SqliteTaskNotificationRepository
  implements TaskNotificationRepository
{
  constructor(private readonly client: SqliteClient) {}

  async findByTask(taskId: UniqueId): Promise<TaskNotificationLink[]> {
    const rows = await this.client.getAll<TaskNotificationRow>(
      'SELECT task_id, notification_id FROM task_notifications WHERE task_id = ?',
      taskId,
    );
    return rows.map((row) => ({
      taskId: UniqueId.from(row.task_id),
      notificationId: row.notification_id,
    }));
  }

  async save(link: TaskNotificationLink): Promise<void> {
    await this.client.run(
      `INSERT INTO task_notifications (task_id, notification_id)
       VALUES (?, ?)
       ON CONFLICT(task_id, notification_id) DO NOTHING`,
      link.taskId,
      link.notificationId,
    );
  }

  async deleteByTask(taskId: UniqueId): Promise<void> {
    await this.client.run(
      'DELETE FROM task_notifications WHERE task_id = ?',
      taskId,
    );
  }
}
