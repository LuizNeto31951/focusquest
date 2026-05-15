import { NotFoundError } from '@/shared/errors';
import type { UniqueId } from '@/shared/types';
import type { Task } from '@/domain/entities';
import type { TaskRepository } from '@/domain/repositories';

export interface TaskWithSubtasks {
  readonly task: Task;
  readonly subtasks: Task[];
}

export interface GetTaskWithSubtasksInput {
  id: UniqueId;
}

export class GetTaskWithSubtasksUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(input: GetTaskWithSubtasksInput): Promise<TaskWithSubtasks> {
    const task = await this.taskRepository.findById(input.id);
    if (!task) throw new NotFoundError('Task', input.id);
    const subtasks = await this.taskRepository.findSubtasksOf(task.id);
    return { task, subtasks };
  }
}
