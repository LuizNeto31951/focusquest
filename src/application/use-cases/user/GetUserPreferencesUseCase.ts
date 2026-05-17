import type { UniqueId } from '@/shared/types';
import type { UserPreferences } from '@/domain/entities';
import type { UserPreferencesRepository } from '@/domain/repositories';

export interface GetUserPreferencesInput {
  userId: UniqueId;
}

export class GetUserPreferencesUseCase {
  constructor(
    private readonly repository: UserPreferencesRepository,
  ) {}

  async execute(input: GetUserPreferencesInput): Promise<UserPreferences | null> {
    return this.repository.findByUser(input.userId);
  }
}
