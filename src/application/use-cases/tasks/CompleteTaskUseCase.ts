import { NotFoundError, ValidationError } from '@/shared/errors';
import type { UniqueId, ISODate } from '@/shared/types';
import {
  awardXP,
  canCompleteParent,
  completeTask,
  createXPLog,
  dayKeyFromISODate,
  isSubtask,
  isTaskCompleted,
  recordDailyCompletion,
  setStreak,
  type Achievement,
  type Task,
  type User,
} from '@/domain/entities';
import { XP } from '@/domain/value-objects';
import type {
  TaskDailyCompletionRepository,
  TaskRepository,
  UserRepository,
  XPLogRepository,
} from '@/domain/repositories';
import {
  StreakCalculator,
  XPCalculator,
  type TaskXPBreakdown,
} from '@/domain/services';
import type { Clock, IdGenerator } from '@/application/ports';
import type { EvaluateAchievementsUseCase } from '@/application/use-cases/gamification';

export interface CompleteTaskInput {
  taskId: UniqueId;
}

export interface CompleteTaskOutput {
  readonly task: Task;
  readonly user: User;
  readonly xpAwarded: XP;
  readonly breakdown: TaskXPBreakdown | null;
  readonly newlyUnlockedAchievements: Achievement[];
}

export class CompleteTaskUseCase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly userRepository: UserRepository,
    private readonly xpLogRepository: XPLogRepository,
    private readonly dailyCompletionRepository: TaskDailyCompletionRepository,
    private readonly evaluateAchievements: EvaluateAchievementsUseCase,
    private readonly clock: Clock,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(input: CompleteTaskInput): Promise<CompleteTaskOutput> {
    const task = await this.taskRepository.findById(input.taskId);
    if (!task) throw new NotFoundError('Task', input.taskId);

    const now = this.clock.now();
    const nowDate = new Date(now);
    const dayKey = dayKeyFromISODate(now);

    if (task.isRecurring) {
      const existing = await this.dailyCompletionRepository.findByTaskAndDay(
        task.id,
        dayKey,
      );
      if (existing) {
        throw new ValidationError('Recurring task is already completed today');
      }
    } else if (isTaskCompleted(task)) {
      throw new ValidationError('Task is already completed');
    }

    if (!isSubtask(task) && !task.isRecurring) {
      const subtasks = await this.taskRepository.findSubtasksOf(task.id);
      if (!canCompleteParent(task, subtasks)) {
        throw new ValidationError(
          'Parent task cannot be completed: pending subtasks remain',
        );
      }
    }

    const user = await this.userRepository.findById(task.userId);
    if (!user) throw new NotFoundError('User', task.userId);

    const updatedStreak = StreakCalculator.recordActivity(user.streak, now);

    const persistedTask = task.isRecurring ? task : completeTask(task, now);

    const { xpAwarded, breakdown } = await this.computeAndAwardXP({
      task: persistedTask,
      user,
      now,
      nowDate,
      currentStreakDays: updatedStreak.current,
    });

    const userAfterXP = awardXP(user, xpAwarded, now);
    const userAfterStreak = setStreak(userAfterXP, updatedStreak, now);

    if (task.isRecurring) {
      await this.dailyCompletionRepository.save(
        recordDailyCompletion(task.id, dayKey, now),
      );
    } else {
      await this.taskRepository.save(persistedTask);
    }
    await this.userRepository.save(userAfterStreak);

    const newlyUnlockedAchievements = await this.evaluateAchievements.execute({
      userId: user.id,
    });

    return {
      task: persistedTask,
      user: userAfterStreak,
      xpAwarded,
      breakdown,
      newlyUnlockedAchievements,
    };
  }

  private async computeAndAwardXP(params: {
    task: Task;
    user: User;
    now: ISODate;
    nowDate: Date;
    currentStreakDays: number;
  }): Promise<{ xpAwarded: XP; breakdown: TaskXPBreakdown | null }> {
    const { task, user, now, nowDate, currentStreakDays } = params;

    if (isSubtask(task) && task.parentTaskId) {
      const parent = await this.taskRepository.findById(task.parentTaskId);
      if (!parent) throw new NotFoundError('Task', task.parentTaskId);

      const siblings = await this.taskRepository.findSubtasksOf(parent.id);
      const parentBreakdown = XPCalculator.forTaskCompletion({
        task: parent,
        completedAt: nowDate,
        currentStreakDays,
      });
      const xp = XPCalculator.forSubtaskCompletion(
        parentBreakdown.total,
        siblings.length,
      );
      await this.logXP(user.id, xp, 'SUBTASK_COMPLETION', task.id, now);
      return { xpAwarded: xp, breakdown: null };
    }

    const breakdown = XPCalculator.forTaskCompletion({
      task,
      completedAt: nowDate,
      currentStreakDays,
    });
    await this.logXP(user.id, breakdown.total, 'TASK_COMPLETION', task.id, now);
    return { xpAwarded: breakdown.total, breakdown };
  }

  private async logXP(
    userId: UniqueId,
    amount: XP,
    source: 'TASK_COMPLETION' | 'SUBTASK_COMPLETION',
    taskId: UniqueId,
    now: ISODate,
  ): Promise<void> {
    if (amount <= 0) return;
    await this.xpLogRepository.save(
      createXPLog({
        id: this.idGenerator.next(),
        userId,
        source,
        amount,
        taskId,
        now,
      }),
    );
  }
}
