import { NotFoundError, ValidationError } from '@/shared/errors';
import type { UniqueId } from '@/shared/types';
import {
  awardXP,
  createXPLog,
  earnCoins,
  endFocusSession,
  focusSessionDurationMinutes,
  isFocusSessionActive,
  type Achievement,
  type FocusSession,
  type User,
} from '@/domain/entities';
import { XP } from '@/domain/value-objects';
import type {
  FocusSessionRepository,
  UserRepository,
  XPLogRepository,
} from '@/domain/repositories';
import { XPCalculator } from '@/domain/services';
import type { AppBlocker, Clock, IdGenerator } from '@/application/ports';
import type { EvaluateAchievementsUseCase } from '@/application/use-cases/gamification';
import { CoinRewardCalculator } from '@/application/use-cases/shop';

export interface EndFocusSessionInput {
  sessionId: UniqueId;
  wasInterrupted: boolean;
}

export interface EndFocusSessionOutput {
  readonly session: FocusSession;
  readonly user: User;
  readonly xpAwarded: XP;
  readonly coinsAwarded: number;
  readonly newlyUnlockedAchievements: Achievement[];
}

export class EndFocusSessionUseCase {
  constructor(
    private readonly focusSessionRepository: FocusSessionRepository,
    private readonly userRepository: UserRepository,
    private readonly xpLogRepository: XPLogRepository,
    private readonly evaluateAchievements: EvaluateAchievementsUseCase,
    private readonly clock: Clock,
    private readonly idGenerator: IdGenerator,
    private readonly appBlocker: AppBlocker,
  ) {}

  async execute(input: EndFocusSessionInput): Promise<EndFocusSessionOutput> {
    const session = await this.focusSessionRepository.findById(input.sessionId);
    if (!session) throw new NotFoundError('FocusSession', input.sessionId);
    if (!isFocusSessionActive(session)) {
      throw new ValidationError('FocusSession is already ended');
    }

    const user = await this.userRepository.findById(session.userId);
    if (!user) throw new NotFoundError('User', session.userId);

    const now = this.clock.now();
    const ended = endFocusSession(session, now, input.wasInterrupted);

    const xpAwarded = input.wasInterrupted
      ? XP.zero()
      : XPCalculator.forCompletedFocusSession();

    const durationMinutes = focusSessionDurationMinutes(ended, now);
    const coinsAwarded = input.wasInterrupted
      ? 0
      : CoinRewardCalculator.forFocusSession(durationMinutes);

    let updatedUser = user;
    if (xpAwarded > 0) updatedUser = awardXP(updatedUser, xpAwarded, now);
    if (coinsAwarded > 0)
      updatedUser = earnCoins(updatedUser, coinsAwarded, now);

    await this.focusSessionRepository.save(ended);
    if (xpAwarded > 0 || coinsAwarded > 0) {
      await this.userRepository.save(updatedUser);
    }
    if (xpAwarded > 0) {
      await this.xpLogRepository.save(
        createXPLog({
          id: this.idGenerator.next(),
          userId: user.id,
          source: 'FOCUS_SESSION',
          amount: xpAwarded,
          focusSessionId: ended.id,
          now,
        }),
      );
    }

    if (this.appBlocker.isSupported) {
      try {
        await this.appBlocker.stopBlocking();
      } catch {
        // ignora — usuário pode ter revogado permissão
      }
    }

    const newlyUnlockedAchievements = await this.evaluateAchievements.execute({
      userId: user.id,
    });

    return {
      session: ended,
      user: updatedUser,
      xpAwarded,
      coinsAwarded,
      newlyUnlockedAchievements,
    };
  }
}
