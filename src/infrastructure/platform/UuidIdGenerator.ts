import { UniqueId } from '@/shared/types';
import type { IdGenerator } from '@/application/ports';

export class UuidIdGenerator implements IdGenerator {
  next(): UniqueId {
    return UniqueId.generate();
  }
}
