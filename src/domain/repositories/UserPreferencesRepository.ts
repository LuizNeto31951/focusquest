import type { UniqueId } from '@/shared/types';
import type { UserPreferences } from '@/domain/entities';

export interface UserPreferencesRepository {
  findByUser(userId: UniqueId): Promise<UserPreferences | null>;
  save(preferences: UserPreferences): Promise<void>;
}
