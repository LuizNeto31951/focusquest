import type { UniqueId } from '@/shared/types';
import type { XPLog } from '@/domain/entities';
import type { XPLogRepository } from '@/domain/repositories';

export interface ListXPHistoryInput {
  userId: UniqueId;
  limit?: number;
}

export class ListXPHistoryUseCase {
  constructor(private readonly xpLogRepository: XPLogRepository) {}

  async execute(input: ListXPHistoryInput): Promise<XPLog[]> {
    return this.xpLogRepository.findByUser(input.userId, input.limit);
  }
}
