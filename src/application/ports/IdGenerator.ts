import type { UniqueId } from '@/shared/types';

export interface IdGenerator {
  next(): UniqueId;
}
