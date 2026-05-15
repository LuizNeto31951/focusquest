import { ISODate, type UniqueId } from '@/shared/types';
import { dayKeyFromISODate } from '@/domain/entities';
import type {
  FocusSessionRepository,
  TaskDailyCompletionRepository,
  TaskRepository,
  UserRepository,
  XPLogRepository,
} from '@/domain/repositories';
import {
  addDays,
  minutesBetween,
  startOfDay,
} from '@/shared/utils/dates';
import type { Clock } from '@/application/ports';

export interface DailyStats {
  readonly day: ISODate;
  readonly dayKey: string;
  readonly xpGained: number;
  readonly tasksCompleted: number;
  readonly focusMinutes: number;
}

export interface WeeklyStats {
  readonly days: readonly DailyStats[];
  readonly totalXP: number;
  readonly totalTasks: number;
  readonly totalFocusMinutes: number;
  readonly currentStreakDays: number;
  readonly longestStreakDays: number;
}

export interface GetWeeklyStatsInput {
  userId: UniqueId;
  days?: number;
}

const DEFAULT_DAYS = 7;

export class GetWeeklyStatsUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly xpLogRepository: XPLogRepository,
    private readonly taskRepository: TaskRepository,
    private readonly dailyCompletionRepository: TaskDailyCompletionRepository,
    private readonly focusSessionRepository: FocusSessionRepository,
    private readonly clock: Clock,
  ) {}

  async execute(input: GetWeeklyStatsInput): Promise<WeeklyStats> {
    const totalDays = input.days ?? DEFAULT_DAYS;
    const now = this.clock.now();
    const todayStart = startOfDay(new Date(now));
    const startWindow = addDays(todayStart, -(totalDays - 1));
    const startISO = ISODate.fromDate(startWindow);

    const xpLogs = await this.xpLogRepository.findByUserSince(
      input.userId,
      startISO,
    );

    const tasksCompletedInRange = await this.taskRepository.findMany({
      userId: input.userId,
      onlyCompleted: true,
    });

    const days: DailyStats[] = [];
    for (let i = 0; i < totalDays; i++) {
      const dayDate = addDays(startWindow, i);
      const dayISO = ISODate.fromDate(dayDate);
      const dayKey = dayKeyFromISODate(dayISO);

      const xpGained = xpLogs
        .filter((log) => dayKeyFromISODate(log.createdAt) === dayKey)
        .reduce((sum, log) => sum + log.amount, 0);

      const nonRecurringCount = tasksCompletedInRange.filter(
        (t) => t.completedAt && dayKeyFromISODate(t.completedAt) === dayKey,
      ).length;
      const recurringCompletions =
        await this.dailyCompletionRepository.findByDay(input.userId, dayKey);
      const tasksCompleted = nonRecurringCount + recurringCompletions.length;

      const sessions = await this.focusSessionRepository.findByUserAndDay(
        input.userId,
        dayISO,
      );
      const focusMinutes = sessions
        .filter((s) => s.endedAt)
        .reduce(
          (sum, s) =>
            sum + minutesBetween(new Date(s.startedAt), new Date(s.endedAt!)),
          0,
        );

      days.push({
        day: dayISO,
        dayKey,
        xpGained,
        tasksCompleted,
        focusMinutes,
      });
    }

    const user = await this.userRepository.findById(input.userId);

    return {
      days,
      totalXP: days.reduce((s, d) => s + d.xpGained, 0),
      totalTasks: days.reduce((s, d) => s + d.tasksCompleted, 0),
      totalFocusMinutes: days.reduce((s, d) => s + d.focusMinutes, 0),
      currentStreakDays: user?.streak.current ?? 0,
      longestStreakDays: user?.streak.longest ?? 0,
    };
  }
}
