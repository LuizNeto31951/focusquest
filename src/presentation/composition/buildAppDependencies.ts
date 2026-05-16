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
  ListXPHistoryUseCase,
  GetWeeklyStatsUseCase,
  GetActivityCalendarUseCase,
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
  ExpoNotificationScheduler,
  SystemClock,
  UuidIdGenerator,
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

  const clock = new SystemClock();
  const idGenerator = new UuidIdGenerator();
  const notificationScheduler = new ExpoNotificationScheduler(
    taskNotificationRepository,
  );

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
    ),
    endFocusSession: new EndFocusSessionUseCase(
      focusSessionRepository,
      userRepository,
      xpLogRepository,
      evaluateAchievements,
      clock,
      idGenerator,
    ),
    getActiveFocusSession: new GetActiveFocusSessionUseCase(
      focusSessionRepository,
    ),

    evaluateAchievements,
    listAchievements: new ListAchievementsUseCase(achievementRepository),

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

    notificationScheduler,
  };
}
