import type { UniqueId, ISODate } from '@/shared/types';
import type { XPLog } from '@/domain/entities';

export interface XPLogRepository {
  save(entry: XPLog): Promise<void>;
  findByUser(userId: UniqueId, limit?: number): Promise<XPLog[]>;
  findByUserSince(userId: UniqueId, since: ISODate): Promise<XPLog[]>;
}
