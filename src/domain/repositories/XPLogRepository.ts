import type { UniqueId } from '@/shared/types';
import type { XPLog } from '@/domain/entities';

export interface XPLogRepository {
  save(entry: XPLog): Promise<void>;
  findByUser(userId: UniqueId, limit?: number): Promise<XPLog[]>;
}
