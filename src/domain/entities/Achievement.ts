export type AchievementRequirement =
  | { readonly kind: 'FIRST_TASK' }
  | { readonly kind: 'TASKS_COMPLETED'; readonly count: number }
  | { readonly kind: 'STREAK'; readonly days: number }
  | { readonly kind: 'FOCUS_SESSIONS_IN_DAY'; readonly count: number }
  | { readonly kind: 'EARLY_BIRD'; readonly beforeHour: number }
  | { readonly kind: 'UNINTERRUPTED_FOCUS_MINUTES'; readonly minutes: number }
  | { readonly kind: 'LEVEL_REACHED'; readonly level: number };

export interface Achievement {
  readonly code: string;
  readonly name: string;
  readonly description: string;
  readonly iconName: string;
  readonly requirement: AchievementRequirement;
  readonly isCustom: boolean;
  readonly coinReward: number;
}

export function coinRewardForRequirement(
  requirement: AchievementRequirement,
): number {
  switch (requirement.kind) {
    case 'FIRST_TASK':
      return 10;
    case 'TASKS_COMPLETED':
      if (requirement.count <= 5) return 15;
      if (requirement.count <= 20) return 30;
      if (requirement.count <= 100) return 75;
      return 150;
    case 'STREAK':
      if (requirement.days <= 3) return 20;
      if (requirement.days <= 7) return 40;
      if (requirement.days <= 30) return 100;
      return 200;
    case 'FOCUS_SESSIONS_IN_DAY':
      return Math.max(10, requirement.count * 8);
    case 'EARLY_BIRD':
      return 25;
    case 'UNINTERRUPTED_FOCUS_MINUTES':
      return Math.max(15, Math.floor(requirement.minutes / 15) * 10);
    case 'LEVEL_REACHED':
      return requirement.level * 15;
  }
}
