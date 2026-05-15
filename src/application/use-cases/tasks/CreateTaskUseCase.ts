import { NotFoundError } from '@/shared/errors';
import type { UniqueId, ISODate } from '@/shared/types';
import { createTask, type Task } from '@/domain/entities';
import {
  DurationMinutes,
  type Priority,
  type RecurrenceRule,
} from '@/domain/value-objects';
import type {
  CategoryRepository,
  TaskRepository,
  UserRepository,
} from '@/domain/repositories';
import type {
  Clock,
  IdGenerator,
  NotificationScheduler,
} from '@/application/ports';

export interface CreateTaskInput {
  userId: UniqueId;
  categoryId: UniqueId;
  parentTaskId?: UniqueId;
  title: string;
  description?: string;
  priority: Priority;
  estimatedMinutes: number;
  dueDate?: ISODate;
  scheduledStartAt?: ISODate;
  isRecurring?: boolean;
  recurrenceRule?: RecurrenceRule;
}

export class CreateTaskUseCase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly userRepository: UserRepository,
    private readonly notificationScheduler: NotificationScheduler,
    private readonly clock: Clock,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(input: CreateTaskInput): Promise<Task> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) throw new NotFoundError('User', input.userId);

    const category = await this.categoryRepository.findById(input.categoryId);
    if (!category) throw new NotFoundError('Category', input.categoryId);

    if (input.parentTaskId) {
      const parent = await this.taskRepository.findById(input.parentTaskId);
      if (!parent) throw new NotFoundError('Task', input.parentTaskId);
    }

    const task = createTask({
      id: this.idGenerator.next(),
      userId: input.userId,
      categoryId: input.categoryId,
      parentTaskId: input.parentTaskId,
      title: input.title,
      description: input.description,
      priority: input.priority,
      estimatedMinutes: DurationMinutes.from(input.estimatedMinutes),
      dueDate: input.dueDate,
      scheduledStartAt: input.scheduledStartAt,
      isRecurring: input.isRecurring,
      recurrenceRule: input.recurrenceRule,
      now: this.clock.now(),
    });

    await this.taskRepository.save(task);
    await this.notificationScheduler.scheduleForTask(task);
    return task;
  }
}
