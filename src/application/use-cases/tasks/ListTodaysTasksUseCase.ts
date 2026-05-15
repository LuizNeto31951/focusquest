import type { UniqueId, ISODate } from '@/shared/types';
import { dayKeyFromISODate, type Task } from '@/domain/entities';
import type {
  TaskDailyCompletionRepository,
  TaskRepository,
} from '@/domain/repositories';
import { RecurrenceMatcher } from '@/domain/services';

export interface TaskForDay {
  readonly task: Task;
  readonly isCompletedToday: boolean;
  readonly isRecurringInstance: boolean;
}

export interface ListTodaysTasksInput {
  userId: UniqueId;
  day: ISODate;
}

export class ListTodaysTasksUseCase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly dailyCompletionRepository: TaskDailyCompletionRepository,
  ) {}

  async execute(input: ListTodaysTasksInput): Promise<TaskForDay[]> {
    const dayKey = dayKeyFromISODate(input.day);

    const dueToday = await this.taskRepository.findMany({
      userId: input.userId,
      onlyTopLevel: true,
      dueOnDay: input.day,
    });

    const allTopLevel = await this.taskRepository.findMany({
      userId: input.userId,
      onlyTopLevel: true,
    });

    const recurringToday = allTopLevel.filter(
      (t) =>
        t.isRecurring &&
        t.recurrenceRule !== undefined &&
        RecurrenceMatcher.matches(t.recurrenceRule, t.createdAt, input.day),
    );

    const merged = new Map<string, Task>();
    for (const t of dueToday) merged.set(t.id, t);
    for (const t of recurringToday) merged.set(t.id, t);

    const dailyCompletions = await this.dailyCompletionRepository.findByDay(
      input.userId,
      dayKey,
    );
    const completedTaskIds = new Set(dailyCompletions.map((c) => c.taskId));

    return Array.from(merged.values()).map((task) => ({
      task,
      isRecurringInstance: task.isRecurring,
      isCompletedToday: task.isRecurring
        ? completedTaskIds.has(task.id)
        : task.completedAt !== undefined,
    }));
  }
}
