import { NotFoundError, ValidationError } from '@/shared/errors';
import type { UniqueId, ISODate } from '@/shared/types';
import {
  coinRewardForRequirement,
  isFocusSessionCompletedSuccessfully,
  focusSessionDurationMinutes,
  type Achievement,
  type AchievementRequirement,
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
import type { Clock, IdGenerator } from '@/application/ports';

export interface CreateCustomAchievementInput {
  userId: UniqueId;
  name: string;
  description: string;
  iconName: string;
  requirement: AchievementRequirement;
}

export class CreateCustomAchievementUseCase {
  constructor(
    private readonly achievementRepository: AchievementRepository,
    private readonly userRepository: UserRepository,
    private readonly taskRepository: TaskRepository,
    private readonly focusSessionRepository: FocusSessionRepository,
    private readonly clock: Clock,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(input: CreateCustomAchievementInput): Promise<Achievement> {
    const name = input.name.trim();
    if (name.length === 0) {
      throw new ValidationError('Nome da conquista é obrigatório');
    }
    validateRequirement(input.requirement);

    const snapshot = await this.buildSnapshot(input.userId);
    const baseline = AchievementEvaluator.computeBaseline(snapshot, input.requirement);

    if (AchievementEvaluator.satisfies(snapshot, input.requirement, baseline)) {
      throw new ValidationError(alreadySatisfiedMessage(snapshot, input.requirement));
    }

    const achievement: Achievement = {
      code: `custom_${this.idGenerator.next()}`,
      name,
      description: input.description.trim(),
      iconName: input.iconName,
      requirement: input.requirement,
      isCustom: true,
      coinReward: coinRewardForRequirement(input.requirement),
      baseline,
    };
    await this.achievementRepository.save(achievement);
    return achievement;
  }

  private async buildSnapshot(userId: UniqueId): Promise<UserProgressSnapshot> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundError('User', userId);

    const now: ISODate = this.clock.now();
    const totalTasksCompleted = await this.taskRepository.countCompletedByUser(userId);
    const todaySessions = await this.focusSessionRepository.findByUserAndDay(userId, now);
    const completedToday = todaySessions.filter(isFocusSessionCompletedSuccessfully);

    return {
      totalTasksCompleted,
      currentStreakDays: user.streak.current,
      longestStreakDays: user.streak.longest,
      todayCompletedFocusSessions: completedToday.length,
      longestUninterruptedFocusMinutes: completedToday.reduce(
        (max, s) => Math.max(max, focusSessionDurationMinutes(s, now)),
        0,
      ),
      currentLevel: LevelCalculator.levelFromTotalXP(user.totalXP),
    };
  }
}

function alreadySatisfiedMessage(
  snapshot: UserProgressSnapshot,
  requirement: AchievementRequirement,
): string {
  switch (requirement.kind) {
    case 'STREAK':
      return `Sua maior sequência já é de ${snapshot.longestStreakDays} dias. Defina um objetivo maior que ${snapshot.longestStreakDays}.`;
    case 'FOCUS_SESSIONS_IN_DAY':
      return `Você já completou ${snapshot.todayCompletedFocusSessions} sessões hoje. Defina um objetivo maior.`;
    case 'FIRST_TASK':
      return 'Você já completou sua primeira tarefa.';
    default:
      return 'Você já satisfaz essa condição — defina um objetivo maior.';
  }
}

function validateRequirement(requirement: AchievementRequirement): void {
  switch (requirement.kind) {
    case 'TASKS_COMPLETED':
    case 'FOCUS_SESSIONS_IN_DAY':
      if (requirement.count < 1) {
        throw new ValidationError('Quantidade deve ser >= 1');
      }
      break;
    case 'STREAK':
      if (requirement.days < 1) {
        throw new ValidationError('Sequência deve ser >= 1 dia');
      }
      break;
    case 'UNINTERRUPTED_FOCUS_MINUTES':
      if (requirement.minutes < 1) {
        throw new ValidationError('Minutos deve ser >= 1');
      }
      break;
    case 'LEVEL_REACHED':
      if (requirement.level < 1) {
        throw new ValidationError('Nível deve ser >= 1');
      }
      break;
    case 'EARLY_BIRD':
      if (requirement.beforeHour < 0 || requirement.beforeHour > 23) {
        throw new ValidationError('Hora deve estar entre 0 e 23');
      }
      break;
  }
}
