import { NotFoundError, ValidationError } from '@/shared/errors';
import type { UniqueId, ISODate } from '@/shared/types';
import type { Task } from '@/domain/entities';
import {
  DurationMinutes,
  type Priority,
  type RecurrenceRule,
} from '@/domain/value-objects';
import type {
  CategoryRepository,
  TaskRepository,
} from '@/domain/repositories';
import type { Clock, NotificationScheduler } from '@/application/ports';

export interface UpdateTaskInput {
  id: UniqueId;
  categoryId?: UniqueId;
  title?: string;
  description?: string | null;
  priority?: Priority;
  estimatedMinutes?: number;
  dueDate?: ISODate | null;
  scheduledStartAt?: ISODate | null;
  isRecurring?: boolean;
  recurrenceRule?: RecurrenceRule | null;
}

export class UpdateTaskUseCase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly notificationScheduler: NotificationScheduler,
    private readonly clock: Clock,
  ) {}

  async execute(input: UpdateTaskInput): Promise<Task> {
    const existing = await this.taskRepository.findById(input.id);
    if (!existing) throw new NotFoundError('Task', input.id);

    if (input.categoryId) {
      const category = await this.categoryRepository.findById(input.categoryId);
      if (!category) throw new NotFoundError('Category', input.categoryId);
    }

    if (input.title !== undefined && input.title.trim().length === 0) {
      throw new ValidationError('Task title cannot be empty');
    }

    const updated: Task = {
      ...existing,
      categoryId: input.categoryId ?? existing.categoryId,
      title: input.title?.trim() ?? existing.title,
      description:
        input.description === null
          ? undefined
          : input.description?.trim() || existing.description,
      priority: input.priority ?? existing.priority,
      estimatedMinutes:
        input.estimatedMinutes !== undefined
          ? DurationMinutes.from(input.estimatedMinutes)
          : existing.estimatedMinutes,
      dueDate:
        input.dueDate === null ? undefined : input.dueDate ?? existing.dueDate,
      scheduledStartAt:
        input.scheduledStartAt === null
          ? undefined
          : input.scheduledStartAt ?? existing.scheduledStartAt,
      isRecurring: input.isRecurring ?? existing.isRecurring,
      recurrenceRule:
        input.recurrenceRule === null
          ? undefined
          : input.recurrenceRule ?? existing.recurrenceRule,
      updatedAt: this.clock.now(),
    };

    if (updated.isRecurring && !updated.recurrenceRule) {
      throw new ValidationError('Recurring task requires a recurrenceRule');
    }

    await this.taskRepository.save(updated);
    await this.notificationScheduler.scheduleForTask(updated);
    return updated;
  }
}
