import { ValidationError } from '@/shared/errors';
import type { UniqueId, ISODate } from '@/shared/types';
import type { Priority, DurationMinutes, RecurrenceRule } from '@/domain/value-objects';

export interface Task {
  readonly id: UniqueId;
  readonly userId: UniqueId;
  readonly categoryId: UniqueId;
  readonly parentTaskId?: UniqueId;
  readonly title: string;
  readonly description?: string;
  readonly priority: Priority;
  readonly estimatedMinutes: DurationMinutes;
  readonly dueDate?: ISODate;
  readonly completedAt?: ISODate;
  readonly isRecurring: boolean;
  readonly recurrenceRule?: RecurrenceRule;
  readonly createdAt: ISODate;
  readonly updatedAt: ISODate;
}

export interface CreateTaskProps {
  id: UniqueId;
  userId: UniqueId;
  categoryId: UniqueId;
  parentTaskId?: UniqueId;
  title: string;
  description?: string;
  priority: Priority;
  estimatedMinutes: DurationMinutes;
  dueDate?: ISODate;
  isRecurring?: boolean;
  recurrenceRule?: RecurrenceRule;
  now: ISODate;
}

export function createTask(props: CreateTaskProps): Task {
  const title = props.title.trim();
  if (title.length === 0) {
    throw new ValidationError('Task title cannot be empty');
  }
  if (props.isRecurring && !props.recurrenceRule) {
    throw new ValidationError('Recurring task requires a recurrenceRule');
  }
  if (props.parentTaskId && props.isRecurring) {
    throw new ValidationError('Subtask cannot be recurring (only parent can be)');
  }

  return {
    id: props.id,
    userId: props.userId,
    categoryId: props.categoryId,
    parentTaskId: props.parentTaskId,
    title,
    description: props.description?.trim() || undefined,
    priority: props.priority,
    estimatedMinutes: props.estimatedMinutes,
    dueDate: props.dueDate,
    isRecurring: props.isRecurring ?? false,
    recurrenceRule: props.recurrenceRule,
    createdAt: props.now,
    updatedAt: props.now,
  };
}

export function completeTask(task: Task, completedAt: ISODate): Task {
  if (isTaskCompleted(task)) return task;
  return { ...task, completedAt, updatedAt: completedAt };
}

export function reopenTask(task: Task, now: ISODate): Task {
  if (!isTaskCompleted(task)) return task;
  return { ...task, completedAt: undefined, updatedAt: now };
}

export function isTaskCompleted(task: Task): boolean {
  return task.completedAt !== undefined;
}

export function isSubtask(task: Task): boolean {
  return task.parentTaskId !== undefined;
}

export function isTaskOverdue(task: Task, now: ISODate): boolean {
  if (!task.dueDate || isTaskCompleted(task)) return false;
  return new Date(task.dueDate).getTime() < new Date(now).getTime();
}

export function canCompleteParent(parent: Task, subtasks: readonly Task[]): boolean {
  if (isTaskCompleted(parent)) return false;
  if (subtasks.length === 0) return true;
  return subtasks.every(isTaskCompleted);
}
