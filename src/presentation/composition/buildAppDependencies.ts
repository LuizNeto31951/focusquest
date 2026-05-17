import {
  EnsureCurrentUserUseCase,
  GetUserStatsUseCase,
  SkipDayUseCase,
  UpdateUserProfileUseCase,
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
import {
  type SqliteClient,
  SqliteCategoryRepository,
  SqliteTaskRepository,
  SqliteUserRepository,
  SqliteAchievementRepository,
  SqliteFocusSessionRepository,
  SqliteXPLogRepository,
  SqliteTaskDailyCompletionRepository,
  SqliteTaskNotificationRepository,
  SqliteRewardRepository,
  SqliteRewardRedemptionRepository,
  ExpoNotificationScheduler,
  SystemClock,
  UuidIdGenerator,
  ExpoAppBlocker,
} from '@/infrastructure';
import type { AppDependencies } from './AppDependencies';

export function buildAppDependencies(client: SqliteClient): AppDependencies {
  const categoryRepository = new SqliteCategoryRepository(client);
  const taskRepository = new SqliteTaskRepository(client);
  const userRepository = new SqliteUserRepository(client);
  const achievementRepository = new SqliteAchievementRepository(client);
  const focusSessionRepository = new SqliteFocusSessionRepository(client);
  const xpLogRepository = new SqliteXPLogRepository(client);
  const dailyCompletionRepository = new SqliteTaskDailyCompletionRepository(client);
  const taskNotificationRepository = new SqliteTaskNotificationRepository(client);
  const rewardRepository = new SqliteRewardRepository(client);
  const rewardRedemptionRepository = new SqliteRewardRedemptionRepository(client);

  const clock = new SystemClock();
  const idGenerator = new UuidIdGenerator();
  const notificationScheduler = new ExpoNotificationScheduler(
    taskNotificationRepository,
  );
  const appBlocker = new ExpoAppBlocker();

  const evaluateAchievements = new EvaluateAchievementsUseCase(
    userRepository,
    taskRepository,
    focusSessionRepository,
    achievementRepository,
    clock,
  );

  return {
    ensureCurrentUser: new EnsureCurrentUserUseCase(
      userRepository,
      clock,
      idGenerator,
    ),
    getUserStats: new GetUserStatsUseCase(userRepository),
    skipDay: new SkipDayUseCase(userRepository, clock),
    updateUserProfile: new UpdateUserProfileUseCase(userRepository, clock),

    listCategories: new ListCategoriesUseCase(categoryRepository),
    createCategory: new CreateCategoryUseCase(categoryRepository, idGenerator),
    updateCategory: new UpdateCategoryUseCase(categoryRepository),
    deleteCategory: new DeleteCategoryUseCase(categoryRepository),

    createTask: new CreateTaskUseCase(
      taskRepository,
      categoryRepository,
      userRepository,
      notificationScheduler,
      clock,
      idGenerator,
    ),
    updateTask: new UpdateTaskUseCase(
      taskRepository,
      categoryRepository,
      notificationScheduler,
      clock,
    ),
    deleteTask: new DeleteTaskUseCase(taskRepository, notificationScheduler),
    completeTask: new CompleteTaskUseCase(
      taskRepository,
      userRepository,
      xpLogRepository,
      dailyCompletionRepository,
      evaluateAchievements,
      clock,
      idGenerator,
    ),
    listTasks: new ListTasksUseCase(taskRepository),
    listTodaysTasks: new ListTodaysTasksUseCase(
      taskRepository,
      dailyCompletionRepository,
    ),
    getTaskWithSubtasks: new GetTaskWithSubtasksUseCase(taskRepository),

    startFocusSession: new StartFocusSessionUseCase(
      focusSessionRepository,
      userRepository,
      taskRepository,
      clock,
      idGenerator,
      appBlocker,
    ),
    endFocusSession: new EndFocusSessionUseCase(
      focusSessionRepository,
      userRepository,
      xpLogRepository,
      evaluateAchievements,
      clock,
      idGenerator,
      appBlocker,
    ),
    getActiveFocusSession: new GetActiveFocusSessionUseCase(
      focusSessionRepository,
    ),

    evaluateAchievements,
    listAchievements: new ListAchievementsUseCase(achievementRepository),
    createCustomAchievement: new CreateCustomAchievementUseCase(
      achievementRepository,
      idGenerator,
    ),
    deleteCustomAchievement: new DeleteCustomAchievementUseCase(
      achievementRepository,
    ),

    listXPHistory: new ListXPHistoryUseCase(xpLogRepository),
    getWeeklyStats: new GetWeeklyStatsUseCase(
      userRepository,
      xpLogRepository,
      taskRepository,
      dailyCompletionRepository,
      focusSessionRepository,
      clock,
    ),
    getActivityCalendar: new GetActivityCalendarUseCase(
      taskRepository,
      dailyCompletionRepository,
      clock,
    ),

    listRewards: new ListRewardsUseCase(rewardRepository),
    createReward: new CreateRewardUseCase(
      rewardRepository,
      clock,
      idGenerator,
    ),
    updateReward: new UpdateRewardUseCase(rewardRepository, clock),
    deleteReward: new DeleteRewardUseCase(rewardRepository),
    redeemReward: new RedeemRewardUseCase(
      rewardRepository,
      rewardRedemptionRepository,
      userRepository,
      clock,
      idGenerator,
    ),
    listRedemptions: new ListRedemptionsUseCase(rewardRedemptionRepository),
    getShopStats: new GetShopStatsUseCase(
      userRepository,
      rewardRedemptionRepository,
    ),

    notificationScheduler,
    appBlocker,
  };
}
