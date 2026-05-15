import type {
  Achievement,
  AchievementRequirement,
  UserAchievement,
} from '@/domain/entities';

export interface UserProgressSnapshot {
  readonly totalTasksCompleted: number;
  readonly currentStreakDays: number;
  readonly longestStreakDays: number;
  readonly todayCompletedFocusSessions: number;
  readonly longestUninterruptedFocusMinutes: number;
  readonly currentLevel: number;
  readonly earliestTaskCompletionHourToday?: number;
}

export const AchievementEvaluator = {
  findNewlyUnlocked(
    snapshot: UserProgressSnapshot,
    allAchievements: readonly Achievement[],
    alreadyUnlocked: readonly UserAchievement[],
  ): Achievement[] {
    const unlockedCodes = new Set(alreadyUnlocked.map((u) => u.achievementCode));
    return allAchievements.filter(
      (a) => !unlockedCodes.has(a.code) && satisfies(snapshot, a.requirement),
    );
  },

  satisfies,
};

function satisfies(
  snapshot: UserProgressSnapshot,
  requirement: AchievementRequirement,
): boolean {
  switch (requirement.kind) {
    case 'FIRST_TASK':
      return snapshot.totalTasksCompleted >= 1;
    case 'TASKS_COMPLETED':
      return snapshot.totalTasksCompleted >= requirement.count;
    case 'STREAK':
      return snapshot.longestStreakDays >= requirement.days;
    case 'FOCUS_SESSIONS_IN_DAY':
      return snapshot.todayCompletedFocusSessions >= requirement.count;
    case 'EARLY_BIRD':
      return (
        snapshot.earliestTaskCompletionHourToday !== undefined &&
        snapshot.earliestTaskCompletionHourToday < requirement.beforeHour
      );
    case 'UNINTERRUPTED_FOCUS_MINUTES':
      return snapshot.longestUninterruptedFocusMinutes >= requirement.minutes;
    case 'LEVEL_REACHED':
      return snapshot.currentLevel >= requirement.level;
  }
}
