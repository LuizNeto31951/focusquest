import {
  EnsureCurrentUserUseCase,
  GetUserStatsUseCase,
  SkipDayUseCase,
  ListCategoriesUseCase,
  CreateCategoryUseCase,
  RenameCategoryUseCase,
  DeleteCategoryUseCase,
  CreateTaskUseCase,
  UpdateTaskUseCase,
  DeleteTaskUseCase,
  CompleteTaskUseCase,
  ListTasksUseCase,
  GetTaskWithSubtasksUseCase,
  StartFocusSessionUseCase,
  EndFocusSessionUseCase,
  GetActiveFocusSessionUseCase,
  EvaluateAchievementsUseCase,
  ListAchievementsUseCase,
  ListXPHistoryUseCase,
} from '@/application';
import {
  type SqliteClient,
  SqliteCategoryRepository,
  SqliteTaskRepository,
  SqliteUserRepository,
  SqliteAchievementRepository,
  SqliteFocusSessionRepository,
  SqliteXPLogRepository,
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

  const clock = new SystemClock();
  const idGenerator = new UuidIdGenerator();

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

    listCategories: new ListCategoriesUseCase(categoryRepository),
    createCategory: new CreateCategoryUseCase(categoryRepository, idGenerator),
    renameCategory: new RenameCategoryUseCase(categoryRepository),
    deleteCategory: new DeleteCategoryUseCase(categoryRepository),

    createTask: new CreateTaskUseCase(
      taskRepository,
      categoryRepository,
      userRepository,
      clock,
      idGenerator,
    ),
    updateTask: new UpdateTaskUseCase(taskRepository, categoryRepository, clock),
    deleteTask: new DeleteTaskUseCase(taskRepository),
    completeTask: new CompleteTaskUseCase(
      taskRepository,
      userRepository,
      xpLogRepository,
      evaluateAchievements,
      clock,
      idGenerator,
    ),
    listTasks: new ListTasksUseCase(taskRepository),
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
  };
}
