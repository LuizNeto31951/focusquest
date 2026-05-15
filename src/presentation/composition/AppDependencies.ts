import type {
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
  ListTodaysTasksUseCase,
  GetTaskWithSubtasksUseCase,
  StartFocusSessionUseCase,
  EndFocusSessionUseCase,
  GetActiveFocusSessionUseCase,
  EvaluateAchievementsUseCase,
  ListAchievementsUseCase,
  ListXPHistoryUseCase,
  GetWeeklyStatsUseCase,
} from '@/application';
import type { NotificationScheduler } from '@/application/ports';

export interface AppDependencies {
  readonly ensureCurrentUser: EnsureCurrentUserUseCase;
  readonly getUserStats: GetUserStatsUseCase;
  readonly skipDay: SkipDayUseCase;

  readonly listCategories: ListCategoriesUseCase;
  readonly createCategory: CreateCategoryUseCase;
  readonly renameCategory: RenameCategoryUseCase;
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

  readonly listXPHistory: ListXPHistoryUseCase;
  readonly getWeeklyStats: GetWeeklyStatsUseCase;

  readonly notificationScheduler: NotificationScheduler;
}
