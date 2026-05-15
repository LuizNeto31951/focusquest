import { UniqueId, ISODate } from '@/shared/types';
import { DurationMinutes } from '@/domain/value-objects';
import type { Task } from '@/domain/entities';
import type { Priority, RecurrenceRule } from '@/domain/value-objects';

export interface TaskRow {
  id: string;
  user_id: string;
  category_id: string;
  parent_task_id: string | null;
  title: string;
  description: string | null;
  priority: string;
  estimated_minutes: number;
  due_date: string | null;
  completed_at: string | null;
  is_recurring: number;
  recurrence_rule: string | null;
  created_at: string;
  updated_at: string;
}

export const TaskMapper = {
  toRow(task: Task): TaskRow {
    return {
      id: task.id,
      user_id: task.userId,
      category_id: task.categoryId,
      parent_task_id: task.parentTaskId ?? null,
      title: task.title,
      description: task.description ?? null,
      priority: task.priority,
      estimated_minutes: task.estimatedMinutes,
      due_date: task.dueDate ?? null,
      completed_at: task.completedAt ?? null,
      is_recurring: task.isRecurring ? 1 : 0,
      recurrence_rule: task.recurrenceRule
        ? JSON.stringify(task.recurrenceRule)
        : null,
      created_at: task.createdAt,
      updated_at: task.updatedAt,
    };
  },

  toDomain(row: TaskRow): Task {
    return {
      id: UniqueId.from(row.id),
      userId: UniqueId.from(row.user_id),
      categoryId: UniqueId.from(row.category_id),
      parentTaskId: row.parent_task_id
        ? UniqueId.from(row.parent_task_id)
        : undefined,
      title: row.title,
      description: row.description ?? undefined,
      priority: row.priority as Priority,
      estimatedMinutes: DurationMinutes.from(row.estimated_minutes),
      dueDate: row.due_date ? ISODate.from(row.due_date) : undefined,
      completedAt: row.completed_at ? ISODate.from(row.completed_at) : undefined,
      isRecurring: row.is_recurring === 1,
      recurrenceRule: row.recurrence_rule
        ? (JSON.parse(row.recurrence_rule) as RecurrenceRule)
        : undefined,
      createdAt: ISODate.from(row.created_at),
      updatedAt: ISODate.from(row.updated_at),
    };
  },
};
