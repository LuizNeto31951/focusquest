import { create } from 'zustand';

interface InvalidationState {
  tasksVersion: number;
  categoriesVersion: number;
  achievementsVersion: number;

  bumpTasks: () => void;
  bumpCategories: () => void;
  bumpAchievements: () => void;
}

export const useInvalidationStore = create<InvalidationState>((set) => ({
  tasksVersion: 0,
  categoriesVersion: 0,
  achievementsVersion: 0,

  bumpTasks: () => set((s) => ({ tasksVersion: s.tasksVersion + 1 })),
  bumpCategories: () =>
    set((s) => ({ categoriesVersion: s.categoriesVersion + 1 })),
  bumpAchievements: () =>
    set((s) => ({ achievementsVersion: s.achievementsVersion + 1 })),
}));
