import type { UniqueId, ISODate } from '@/shared/types';
import type { FocusSession } from '@/domain/entities';

export interface FocusSessionRepository {
  findById(id: UniqueId): Promise<FocusSession | null>;
  findActiveByUser(userId: UniqueId): Promise<FocusSession | null>;
  findByUserAndDay(userId: UniqueId, day: ISODate): Promise<FocusSession[]>;
  save(session: FocusSession): Promise<void>;
}
