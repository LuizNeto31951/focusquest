import type { UniqueId, ISODate } from '@/shared/types';
import {
  dayKeyFromISODate,
  isTaskCompleted,
  type Task,
} from '@/domain/entities';
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

    const allTopLevel = await this.taskRepository.findMany({
      userId: input.userId,
      onlyTopLevel: true,
    });

    const relevant = allTopLevel.filter((t) => {
      if (t.isRecurring) {
        return (
          t.recurrenceRule !== undefined &&
          RecurrenceMatcher.matches(t.recurrenceRule, t.createdAt, input.day)
        );
      }
      if (isTaskCompleted(t)) {
        return dayKeyFromISODate(t.completedAt!) === dayKey;
      }
      if (!t.dueDate) return true;
      return dayKeyFromISODate(t.dueDate) <= dayKey;
    });

    const dailyCompletions = await this.dailyCompletionRepository.findByDay(
      input.userId,
      dayKey,
    );
    const completedTaskIds = new Set(dailyCompletions.map((c) => c.taskId));

    return relevant.map((task) => ({
      task,
      isRecurringInstance: task.isRecurring,
      isCompletedToday: task.isRecurring
        ? completedTaskIds.has(task.id)
        : task.completedAt !== undefined,
    }));
  }
}
