import { ISODate, type UniqueId } from '@/shared/types';
import { dayKeyFromISODate } from '@/domain/entities';
import type {
  TaskDailyCompletionRepository,
  TaskRepository,
} from '@/domain/repositories';
import { addDays, startOfDay } from '@/shared/utils/dates';
import type { Clock } from '@/application/ports';

export interface DailyActivity {
  readonly dayKey: string;
  readonly count: number;
}

export interface ActivityCalendar {
  readonly startDay: string;
  readonly endDay: string;
  readonly todayKey: string;
  readonly days: readonly DailyActivity[];
  readonly totalActiveDays: number;
  readonly totalCompletions: number;
}

export interface GetActivityCalendarInput {
  userId: UniqueId;
  weeks?: number;
}

const DEFAULT_WEEKS = 12;
const DAYS_PER_WEEK = 7;

export class GetActivityCalendarUseCase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly dailyCompletionRepository: TaskDailyCompletionRepository,
    private readonly clock: Clock,
  ) {}

  async execute(input: GetActivityCalendarInput): Promise<ActivityCalendar> {
    const totalWeeks = input.weeks ?? DEFAULT_WEEKS;
    const totalDays = totalWeeks * DAYS_PER_WEEK;

    const now = this.clock.now();
    const today = startOfDay(new Date(now));
    const todayDow = today.getDay();
    const gridEnd = addDays(today, DAYS_PER_WEEK - 1 - todayDow);
    const gridStart = addDays(gridEnd, -(totalDays - 1));
    const startKey = dayKeyFromISODate(ISODate.fromDate(gridStart));
    const endKey = dayKeyFromISODate(ISODate.fromDate(gridEnd));
    const todayKey = dayKeyFromISODate(ISODate.fromDate(today));

    const completedTasks = await this.taskRepository.findMany({
      userId: input.userId,
      onlyCompleted: true,
    });
    const recurringCompletions =
      await this.dailyCompletionRepository.findByUserSince(input.userId, startKey);

    const counts = new Map<string, number>();
    for (const task of completedTasks) {
      if (!task.completedAt) continue;
      const key = dayKeyFromISODate(task.completedAt);
      if (key < startKey || key > endKey) continue;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    for (const completion of recurringCompletions) {
      const key = completion.day;
      if (key > endKey) continue;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    const days: DailyActivity[] = [];
    for (let i = 0; i < totalDays; i++) {
      const date = addDays(gridStart, i);
      const key = dayKeyFromISODate(ISODate.fromDate(date));
      days.push({ dayKey: key, count: counts.get(key) ?? 0 });
    }

    const totalActiveDays = days.filter((d) => d.count > 0).length;
    const totalCompletions = days.reduce((sum, d) => sum + d.count, 0);

    return {
      startDay: startKey,
      endDay: endKey,
      todayKey,
      days,
      totalActiveDays,
      totalCompletions,
    };
  }
}
