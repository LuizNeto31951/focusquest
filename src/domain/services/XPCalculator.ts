import type { Task } from '@/domain/entities';
import { XP, type Priority } from '@/domain/value-objects';

const PRIORITY_BASE_XP: Record<Priority, number> = {
  LOW: 10,
  MEDIUM: 20,
  HIGH: 35,
};

const PUNCTUALITY_BONUS_RATE = 0.2;
const STREAK_BONUS_PER_DAY = 0.05;
const STREAK_BONUS_MAX = 0.5;
const FOCUS_SESSION_REWARD = 15;

export interface TaskXPContext {
  readonly task: Task;
  readonly completedAt: Date;
  readonly currentStreakDays: number;
}

export interface TaskXPBreakdown {
  readonly base: number;
  readonly durationMultiplier: number;
  readonly punctualityBonus: number;
  readonly streakBonus: number;
  readonly total: XP;
}

export const XPCalculator = {
  forTaskCompletion(ctx: TaskXPContext): TaskXPBreakdown {
    const base = PRIORITY_BASE_XP[ctx.task.priority];

    const durationMultiplier = 1 + ctx.task.estimatedMinutes / 60;
    const xpAfterDuration = base * durationMultiplier;

    const punctualityBonus = isOnTime(ctx) ? xpAfterDuration * PUNCTUALITY_BONUS_RATE : 0;
    const xpAfterPunctuality = xpAfterDuration + punctualityBonus;

    const streakFactor = Math.min(
      ctx.currentStreakDays * STREAK_BONUS_PER_DAY,
      STREAK_BONUS_MAX,
    );
    const streakBonus = xpAfterPunctuality * streakFactor;

    const total = XP.from(Math.floor(xpAfterPunctuality + streakBonus));

    return {
      base,
      durationMultiplier,
      punctualityBonus: Math.floor(punctualityBonus),
      streakBonus: Math.floor(streakBonus),
      total,
    };
  },

  forSubtaskCompletion(parentTotalXP: XP, totalSubtaskCount: number): XP {
    if (totalSubtaskCount <= 0) return XP.zero();
    return XP.from(Math.floor(parentTotalXP / totalSubtaskCount));
  },

  forCompletedFocusSession(): XP {
    return XP.from(FOCUS_SESSION_REWARD);
  },
};

function isOnTime(ctx: TaskXPContext): boolean {
  if (!ctx.task.dueDate) return false;
  return ctx.completedAt.getTime() <= new Date(ctx.task.dueDate).getTime();
}
