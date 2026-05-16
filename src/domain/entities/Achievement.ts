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
}
