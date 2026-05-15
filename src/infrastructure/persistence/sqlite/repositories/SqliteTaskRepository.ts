import type { UniqueId, ISODate } from '@/shared/types';
import type { Task } from '@/domain/entities';
import type { TaskFilter, TaskRepository } from '@/domain/repositories';
import type { SqliteClient, SqliteParam } from '../SqliteClient';
import { TaskMapper, type TaskRow } from '../mappers';

export class SqliteTaskRepository implements TaskRepository {
  constructor(private readonly client: SqliteClient) {}

  async findById(id: UniqueId): Promise<Task | null> {
    const row = await this.client.get<TaskRow>(
      'SELECT * FROM tasks WHERE id = ?',
      id,
    );
    return row ? TaskMapper.toDomain(row) : null;
  }

  async findMany(filter: TaskFilter): Promise<Task[]> {
    const where: string[] = ['user_id = ?'];
    const params: SqliteParam[] = [filter.userId];

    if (filter.categoryId) {
      where.push('category_id = ?');
      params.push(filter.categoryId);
    }
    if (filter.onlyTopLevel) {
      where.push('parent_task_id IS NULL');
    }
    if (filter.onlyCompleted) {
      where.push('completed_at IS NOT NULL');
    }
    if (filter.onlyPending) {
      where.push('completed_at IS NULL');
    }
    if (filter.dueOnDay) {
      where.push('date(due_date) = date(?)');
      params.push(filter.dueOnDay);
    }

    const sql = `SELECT * FROM tasks WHERE ${where.join(' AND ')} ORDER BY created_at DESC`;
    const rows = await this.client.getAll<TaskRow>(sql, ...params);
    return rows.map(TaskMapper.toDomain);
  }

  async findSubtasksOf(parentId: UniqueId): Promise<Task[]> {
    const rows = await this.client.getAll<TaskRow>(
      'SELECT * FROM tasks WHERE parent_task_id = ? ORDER BY created_at ASC',
      parentId,
    );
    return rows.map(TaskMapper.toDomain);
  }

  async save(task: Task): Promise<void> {
    const r = TaskMapper.toRow(task);
    await this.client.run(
      `INSERT INTO tasks (
        id, user_id, category_id, parent_task_id, title, description,
        priority, estimated_minutes, due_date, completed_at,
        is_recurring, recurrence_rule, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        category_id = excluded.category_id,
        parent_task_id = excluded.parent_task_id,
        title = excluded.title,
        description = excluded.description,
        priority = excluded.priority,
        estimated_minutes = excluded.estimated_minutes,
        due_date = excluded.due_date,
        completed_at = excluded.completed_at,
        is_recurring = excluded.is_recurring,
        recurrence_rule = excluded.recurrence_rule,
        updated_at = excluded.updated_at`,
      r.id,
      r.user_id,
      r.category_id,
      r.parent_task_id,
      r.title,
      r.description,
      r.priority,
      r.estimated_minutes,
      r.due_date,
      r.completed_at,
      r.is_recurring,
      r.recurrence_rule,
      r.created_at,
      r.updated_at,
    );
  }

  async delete(id: UniqueId): Promise<void> {
    await this.client.run('DELETE FROM tasks WHERE id = ?', id);
  }

  async countCompletedByUser(userId: UniqueId): Promise<number> {
    const row = await this.client.get<{ count: number }>(
      'SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND completed_at IS NOT NULL',
      userId,
    );
    return row?.count ?? 0;
  }

  async countCompletedByUserOnDay(
    userId: UniqueId,
    day: ISODate,
  ): Promise<number> {
    const row = await this.client.get<{ count: number }>(
      `SELECT COUNT(*) as count FROM tasks
       WHERE user_id = ?
         AND completed_at IS NOT NULL
         AND date(completed_at) = date(?)`,
      userId,
      day,
    );
    return row?.count ?? 0;
  }
}
