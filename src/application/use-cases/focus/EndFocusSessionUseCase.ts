import { NotFoundError, ValidationError } from '@/shared/errors';
import type { UniqueId } from '@/shared/types';
import {
  awardXP,
  createXPLog,
  endFocusSession,
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
import type { Clock, IdGenerator } from '@/application/ports';
import type { EvaluateAchievementsUseCase } from '@/application/use-cases/gamification';

export interface EndFocusSessionInput {
  sessionId: UniqueId;
  wasInterrupted: boolean;
}

export interface EndFocusSessionOutput {
  readonly session: FocusSession;
  readonly user: User;
  readonly xpAwarded: XP;
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

    const updatedUser = xpAwarded > 0 ? awardXP(user, xpAwarded, now) : user;

    await this.focusSessionRepository.save(ended);
    if (xpAwarded > 0) {
      await this.userRepository.save(updatedUser);
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

    const newlyUnlockedAchievements = await this.evaluateAchievements.execute({
      userId: user.id,
    });

    return {
      session: ended,
      user: updatedUser,
      xpAwarded,
      newlyUnlockedAchievements,
    };
  }
}
