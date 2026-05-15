import type { UniqueId, ISODate } from '@/shared/types';
import type { Task } from '@/domain/entities';

export interface TaskFilter {
  readonly userId: UniqueId;
  readonly categoryId?: UniqueId;
  readonly onlyTopLevel?: boolean;
  readonly onlyCompleted?: boolean;
  readonly onlyPending?: boolean;
  readonly dueOnDay?: ISODate;
}

export interface TaskRepository {
  findById(id: UniqueId): Promise<Task | null>;
  findMany(filter: TaskFilter): Promise<Task[]>;
  findSubtasksOf(parentId: UniqueId): Promise<Task[]>;
  save(task: Task): Promise<void>;
  delete(id: UniqueId): Promise<void>;

  countCompletedByUser(userId: UniqueId): Promise<number>;
  countCompletedByUserOnDay(userId: UniqueId, day: ISODate): Promise<number>;
}
