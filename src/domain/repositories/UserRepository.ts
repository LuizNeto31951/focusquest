import type { UniqueId } from '@/shared/types';
import type { User } from '@/domain/entities';

export interface UserRepository {
  findById(id: UniqueId): Promise<User | null>;
  findCurrent(): Promise<User | null>;
  save(user: User): Promise<void>;
}
