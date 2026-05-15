import type { Task } from '@/domain/entities';
import type { TaskFilter, TaskRepository } from '@/domain/repositories';

export type ListTasksInput = TaskFilter;

export class ListTasksUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(input: ListTasksInput): Promise<Task[]> {
    return this.taskRepository.findMany(input);
  }
}
