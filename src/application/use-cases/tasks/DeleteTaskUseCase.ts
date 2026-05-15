import { NotFoundError } from '@/shared/errors';
import type { UniqueId } from '@/shared/types';
import type { TaskRepository } from '@/domain/repositories';

export interface DeleteTaskInput {
  id: UniqueId;
}

export class DeleteTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(input: DeleteTaskInput): Promise<void> {
    const existing = await this.taskRepository.findById(input.id);
    if (!existing) throw new NotFoundError('Task', input.id);
    await this.taskRepository.delete(input.id);
  }
}
