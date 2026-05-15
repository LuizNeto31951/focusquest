import { create } from 'zustand';
import type { UniqueId } from '@/shared/types';

export type TaskListMode = 'TODAY' | 'ALL' | 'COMPLETED' | 'BY_CATEGORY';

export interface TaskListFilters {
  mode: TaskListMode;
  categoryId?: UniqueId;
}

interface TasksState {
  filters: TaskListFilters;
  setFilters: (filters: TaskListFilters) => void;
}

export const useTasksStore = create<TasksState>((set) => ({
  filters: { mode: 'TODAY' },
  setFilters: (filters) => set({ filters }),
}));
