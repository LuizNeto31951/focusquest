import type {
  EnsureCurrentUserUseCase,
  GetUserStatsUseCase,
  SkipDayUseCase,
  UpdateUserProfileUseCase,
  CompleteOnboardingUseCase,
  ListCategoriesUseCase,
  CreateCategoryUseCase,
  UpdateCategoryUseCase,
  DeleteCategoryUseCase,
  CreateTaskUseCase,
  UpdateTaskUseCase,
  DeleteTaskUseCase,
  CompleteTaskUseCase,
  ListTasksUseCase,
  ListTodaysTasksUseCase,
  GetTaskWithSubtasksUseCase,
  StartFocusSessionUseCase,
  EndFocusSessionUseCase,
  GetActiveFocusSessionUseCase,
  EvaluateAchievementsUseCase,
  ListAchievementsUseCase,
  CreateCustomAchievementUseCase,
  DeleteCustomAchievementUseCase,
  ListXPHistoryUseCase,
  GetWeeklyStatsUseCase,
  GetActivityCalendarUseCase,
  ListRewardsUseCase,
  CreateRewardUseCase,
  UpdateRewardUseCase,
  DeleteRewardUseCase,
  RedeemRewardUseCase,
  ListRedemptionsUseCase,
  GetShopStatsUseCase,
} from '@/application';
import type { AppBlocker, NotificationScheduler } from '@/application/ports';

export interface AppDependencies {
  readonly ensureCurrentUser: EnsureCurrentUserUseCase;
  readonly getUserStats: GetUserStatsUseCase;
  readonly skipDay: SkipDayUseCase;
  readonly updateUserProfile: UpdateUserProfileUseCase;
  readonly completeOnboarding: CompleteOnboardingUseCase;

  readonly listCategories: ListCategoriesUseCase;
  readonly createCategory: CreateCategoryUseCase;
  readonly updateCategory: UpdateCategoryUseCase;
  readonly deleteCategory: DeleteCategoryUseCase;

  readonly createTask: CreateTaskUseCase;
  readonly updateTask: UpdateTaskUseCase;
  readonly deleteTask: DeleteTaskUseCase;
  readonly completeTask: CompleteTaskUseCase;
  readonly listTasks: ListTasksUseCase;
  readonly listTodaysTasks: ListTodaysTasksUseCase;
  readonly getTaskWithSubtasks: GetTaskWithSubtasksUseCase;

  readonly startFocusSession: StartFocusSessionUseCase;
  readonly endFocusSession: EndFocusSessionUseCase;
  readonly getActiveFocusSession: GetActiveFocusSessionUseCase;

  readonly evaluateAchievements: EvaluateAchievementsUseCase;
  readonly listAchievements: ListAchievementsUseCase;
  readonly createCustomAchievement: CreateCustomAchievementUseCase;
  readonly deleteCustomAchievement: DeleteCustomAchievementUseCase;

  readonly listXPHistory: ListXPHistoryUseCase;
  readonly getWeeklyStats: GetWeeklyStatsUseCase;
  readonly getActivityCalendar: GetActivityCalendarUseCase;

  readonly listRewards: ListRewardsUseCase;
  readonly createReward: CreateRewardUseCase;
  readonly updateReward: UpdateRewardUseCase;
  readonly deleteReward: DeleteRewardUseCase;
  readonly redeemReward: RedeemRewardUseCase;
  readonly listRedemptions: ListRedemptionsUseCase;
  readonly getShopStats: GetShopStatsUseCase;

  readonly notificationScheduler: NotificationScheduler;
  readonly appBlocker: AppBlocker;
}
