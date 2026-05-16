import { NotFoundError } from '@/shared/errors';
import type { UniqueId } from '@/shared/types';
import { renameUser, setAvatar, type User } from '@/domain/entities';
import type { UserRepository } from '@/domain/repositories';
import type { Clock } from '@/application/ports';

export interface UpdateUserProfileInput {
  userId: UniqueId;
  name?: string;
  avatarUri?: string | null;
}

export class UpdateUserProfileUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly clock: Clock,
  ) {}

  async execute(input: UpdateUserProfileInput): Promise<User> {
    const existing = await this.userRepository.findById(input.userId);
    if (!existing) throw new NotFoundError('User', input.userId);

    const now = this.clock.now();
    let updated = existing;
    if (input.name !== undefined) {
      updated = renameUser(updated, input.name, now);
    }
    if (input.avatarUri !== undefined) {
      updated = setAvatar(
        updated,
        input.avatarUri === null ? undefined : input.avatarUri,
        now,
      );
    }

    await this.userRepository.save(updated);
    return updated;
  }
}
