import { NotFoundError } from '@/shared/errors';
import type { UniqueId, ISODate } from '@/shared/types';
import {
  earnCoins,
  unlockAchievement,
  type Achievement,
} from '@/domain/entities';
import type {
  AchievementRepository,
  FocusSessionRepository,
  TaskRepository,
  UserRepository,
} from '@/domain/repositories';
import {
  AchievementEvaluator,
  LevelCalculator,
  type UserProgressSnapshot,
} from '@/domain/services';
import {
  focusSessionDurationMinutes,
  isFocusSessionCompletedSuccessfully,
} from '@/domain/entities';
import type { Clock } from '@/application/ports';

export interface EvaluateAchievementsInput {
  userId: UniqueId;
}

export class EvaluateAchievementsUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly taskRepository: TaskRepository,
    private readonly focusSessionRepository: FocusSessionRepository,
    private readonly achievementRepository: AchievementRepository,
    private readonly clock: Clock,
  ) {}

  async execute(input: EvaluateAchievementsInput): Promise<Achievement[]> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) throw new NotFoundError('User', input.userId);

    const now = this.clock.now();
    const snapshot = await this.buildSnapshot(user.id, now);

    const allAchievements = await this.achievementRepository.findAll();
    const alreadyUnlocked = await this.achievementRepository.findUnlockedByUser(
      user.id,
    );

    const newlyUnlocked = AchievementEvaluator.findNewlyUnlocked(
      snapshot,
      allAchievements,
      alreadyUnlocked,
    );

    for (const achievement of newlyUnlocked) {
      await this.achievementRepository.saveUnlock(
        unlockAchievement(user.id, achievement.code, now),
      );
    }

    const totalCoinReward = newlyUnlocked.reduce(
      (sum, a) => sum + (a.coinReward ?? 0),
      0,
    );
    if (totalCoinReward > 0) {
      const fresh = await this.userRepository.findById(user.id);
      if (fresh) {
        await this.userRepository.save(earnCoins(fresh, totalCoinReward, now));
      }
    }

    return newlyUnlocked;
  }

  private async buildSnapshot(
    userId: UniqueId,
    now: ISODate,
  ): Promise<UserProgressSnapshot> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundError('User', userId);

    const totalTasksCompleted =
      await this.taskRepository.countCompletedByUser(userId);

    const todaySessions = await this.focusSessionRepository.findByUserAndDay(
      userId,
      now,
    );
    const todayCompletedFocusSessions = todaySessions.filter(
      isFocusSessionCompletedSuccessfully,
    ).length;

    const longestUninterruptedFocusMinutes = todaySessions
      .filter(isFocusSessionCompletedSuccessfully)
      .reduce(
        (max, s) => Math.max(max, focusSessionDurationMinutes(s, now)),
        0,
      );

    const earliestTaskCompletionHourToday =
      await this.findEarliestCompletionHourToday(userId, now);

    return {
      totalTasksCompleted,
      currentStreakDays: user.streak.current,
      longestStreakDays: user.streak.longest,
      todayCompletedFocusSessions,
      longestUninterruptedFocusMinutes,
      currentLevel: LevelCalculator.levelFromTotalXP(user.totalXP),
      earliestTaskCompletionHourToday,
    };
  }

  private async findEarliestCompletionHourToday(
    userId: UniqueId,
    now: ISODate,
  ): Promise<number | undefined> {
    const todayTasks = await this.taskRepository.findMany({
      userId,
      onlyCompleted: true,
      dueOnDay: now,
    });
    if (todayTasks.length === 0) return undefined;

    let earliest: number | undefined;
    for (const task of todayTasks) {
      if (!task.completedAt) continue;
      const hour = new Date(task.completedAt).getHours();
      if (earliest === undefined || hour < earliest) earliest = hour;
    }
    return earliest;
  }
}
