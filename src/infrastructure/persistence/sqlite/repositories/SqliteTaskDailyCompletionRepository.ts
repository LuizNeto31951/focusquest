import type { UniqueId } from '@/shared/types';
import type { TaskDailyCompletion } from '@/domain/entities';
import type { TaskDailyCompletionRepository } from '@/domain/repositories';
import type { SqliteClient } from '../SqliteClient';
import {
  TaskDailyCompletionMapper,
  type TaskDailyCompletionRow,
} from '../mappers';

export class SqliteTaskDailyCompletionRepository
  implements TaskDailyCompletionRepository
{
  constructor(private readonly client: SqliteClient) {}

  async findByTaskAndDay(
    taskId: UniqueId,
    day: string,
  ): Promise<TaskDailyCompletion | null> {
    const row = await this.client.get<TaskDailyCompletionRow>(
      'SELECT * FROM task_daily_completions WHERE task_id = ? AND day = ?',
      taskId,
      day,
    );
    return row ? TaskDailyCompletionMapper.toDomain(row) : null;
  }

  async findByDay(
    userId: UniqueId,
    day: string,
  ): Promise<TaskDailyCompletion[]> {
    const rows = await this.client.getAll<TaskDailyCompletionRow>(
      `SELECT c.* FROM task_daily_completions c
       INNER JOIN tasks t ON t.id = c.task_id
       WHERE t.user_id = ? AND c.day = ?`,
      userId,
      day,
    );
    return rows.map(TaskDailyCompletionMapper.toDomain);
  }

  async save(completion: TaskDailyCompletion): Promise<void> {
    const r = TaskDailyCompletionMapper.toRow(completion);
    await this.client.run(
      `INSERT INTO task_daily_completions (task_id, day, completed_at)
       VALUES (?, ?, ?)
       ON CONFLICT(task_id, day) DO UPDATE SET
         completed_at = excluded.completed_at`,
      r.task_id,
      r.day,
      r.completed_at,
    );
  }

  async deleteByTaskAndDay(taskId: UniqueId, day: string): Promise<void> {
    await this.client.run(
      'DELETE FROM task_daily_completions WHERE task_id = ? AND day = ?',
      taskId,
      day,
    );
  }
}
