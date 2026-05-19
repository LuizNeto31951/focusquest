import { NotFoundError, ValidationError } from '@/shared/errors';
import type { UniqueId } from '@/shared/types';
import { startFocusSession, type FocusSession } from '@/domain/entities';
import { DurationMinutes } from '@/domain/value-objects';
import type {
  FocusSessionRepository,
  TaskRepository,
  UserRepository,
} from '@/domain/repositories';
import type { AppBlocker, Clock, IdGenerator } from '@/application/ports';

export interface StartFocusSessionInput {
  userId: UniqueId;
  taskId?: UniqueId;
  plannedDurationMinutes: number;
  blockedAppPackages?: readonly string[];
  pomodoroCycles?: number;
  pomodoroBreakMinutes?: number;
}

export class StartFocusSessionUseCase {
  constructor(
    private readonly focusSessionRepository: FocusSessionRepository,
    private readonly userRepository: UserRepository,
    private readonly taskRepository: TaskRepository,
    private readonly clock: Clock,
    private readonly idGenerator: IdGenerator,
    private readonly appBlocker: AppBlocker,
  ) {}

  async execute(input: StartFocusSessionInput): Promise<FocusSession> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) throw new NotFoundError('User', input.userId);

    const active = await this.focusSessionRepository.findActiveByUser(input.userId);
    if (active) {
      throw new ValidationError('There is already an active focus session');
    }

    if (input.taskId) {
      const task = await this.taskRepository.findById(input.taskId);
      if (!task) throw new NotFoundError('Task', input.taskId);
    }

    const session = startFocusSession({
      id: this.idGenerator.next(),
      userId: input.userId,
      taskId: input.taskId,
      plannedDurationMinutes: DurationMinutes.from(input.plannedDurationMinutes),
      blockedAppPackages: input.blockedAppPackages,
      pomodoroCycles: input.pomodoroCycles,
      pomodoroBreakMinutes: input.pomodoroBreakMinutes,
      now: this.clock.now(),
    });

    await this.focusSessionRepository.save(session);

    if (this.appBlocker.isSupported) {
      try {
        await this.appBlocker.startBlocking(input.blockedAppPackages ?? []);
      } catch {
        // não quebra a sessão se o bloqueio/notificação falhar
      }
    }

    return session;
  }
}
