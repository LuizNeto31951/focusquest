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
  GetTaskWithSubtasksUseCase,
  StartFocusSessionUseCase,
  EndFocusSessionUseCase,
  GetActiveFocusSessionUseCase,
  EvaluateAchievementsUseCase,
  ListAchievementsUseCase,
  ListXPHistoryUseCase,
} from '@/application';

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
  readonly getTaskWithSubtasks: GetTaskWithSubtasksUseCase;

  readonly startFocusSession: StartFocusSessionUseCase;
  readonly endFocusSession: EndFocusSessionUseCase;
  readonly getActiveFocusSession: GetActiveFocusSessionUseCase;

  readonly evaluateAchievements: EvaluateAchievementsUseCase;
  readonly listAchievements: ListAchievementsUseCase;

  readonly listXPHistory: ListXPHistoryUseCase;
}
