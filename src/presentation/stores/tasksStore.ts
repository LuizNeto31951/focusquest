import { create } from 'zustand';
import type { UniqueId } from '@/shared/types';
import type { Task } from '@/domain/entities';

export type TaskListMode = 'TODAY' | 'ALL' | 'COMPLETED' | 'BY_CATEGORY';

export interface TaskListFilters {
  mode: TaskListMode;
  categoryId?: UniqueId;
}

interface TasksState {
  tasks: Task[];
  filters: TaskListFilters;
  setTasks: (tasks: Task[]) => void;
  setFilters: (filters: TaskListFilters) => void;
  upsertTask: (task: Task) => void;
  removeTask: (id: UniqueId) => void;
}

export const useTasksStore = create<TasksState>((set) => ({
  tasks: [],
  filters: { mode: 'TODAY' },
  setTasks: (tasks) => set({ tasks }),
  setFilters: (filters) => set({ filters }),
  upsertTask: (task) =>
    set((state) => {
      const idx = state.tasks.findIndex((t) => t.id === task.id);
      if (idx === -1) return { tasks: [task, ...state.tasks] };
      const next = [...state.tasks];
      next[idx] = task;
      return { tasks: next };
    }),
  removeTask: (id) =>
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
}));
