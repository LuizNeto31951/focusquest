import type { UniqueId } from '@/shared/types';
import type { FocusSession } from '@/domain/entities';
import type { FocusSessionRepository } from '@/domain/repositories';

export interface GetActiveFocusSessionInput {
  userId: UniqueId;
}

export class GetActiveFocusSessionUseCase {
  constructor(
    private readonly focusSessionRepository: FocusSessionRepository,
  ) {}

  async execute(input: GetActiveFocusSessionInput): Promise<FocusSession | null> {
    return this.focusSessionRepository.findActiveByUser(input.userId);
  }
}
