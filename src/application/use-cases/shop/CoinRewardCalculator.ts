import type { Task } from '@/domain/entities';
import type { Priority } from '@/domain/value-objects';

const PRIORITY_COINS: Record<Priority, number> = {
  LOW: 1,
  MEDIUM: 3,
  HIGH: 5,
};
const SUBTASK_COINS = 1;
const FOCUS_SESSION_BASE_COINS = 2;
const FOCUS_COINS_PER_15_MIN = 1;

export const CoinRewardCalculator = {
  forTaskCompletion(task: Task): number {
    if (task.parentTaskId) return SUBTASK_COINS;
    return PRIORITY_COINS[task.priority] ?? 1;
  },

  forPriority(priority: Priority): number {
    return PRIORITY_COINS[priority] ?? 1;
  },

  forFocusSession(durationMinutes: number): number {
    if (durationMinutes <= 0) return 0;
    const blocks = Math.floor(durationMinutes / 15);
    return FOCUS_SESSION_BASE_COINS + blocks * FOCUS_COINS_PER_15_MIN;
  },
};
