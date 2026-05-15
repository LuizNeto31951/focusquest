import { createUser, type User } from '@/domain/entities';
import type { UserRepository } from '@/domain/repositories';
import type { Clock, IdGenerator } from '@/application/ports';

export interface EnsureCurrentUserInput {
  defaultName: string;
}

export class EnsureCurrentUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly clock: Clock,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(input: EnsureCurrentUserInput): Promise<User> {
    const existing = await this.userRepository.findCurrent();
    if (existing) return existing;

    const user = createUser({
      id: this.idGenerator.next(),
      name: input.defaultName,
      now: this.clock.now(),
    });
    await this.userRepository.save(user);
    return user;
  }
}
