import { create } from 'zustand';

interface InvalidationState {
  tasksVersion: number;
  categoriesVersion: number;
  achievementsVersion: number;
  rewardsVersion: number;
  redemptionsVersion: number;

  bumpTasks: () => void;
  bumpCategories: () => void;
  bumpAchievements: () => void;
  bumpRewards: () => void;
  bumpRedemptions: () => void;
}

export const useInvalidationStore = create<InvalidationState>((set) => ({
  tasksVersion: 0,
  categoriesVersion: 0,
  achievementsVersion: 0,
  rewardsVersion: 0,
  redemptionsVersion: 0,

  bumpTasks: () => set((s) => ({ tasksVersion: s.tasksVersion + 1 })),
  bumpCategories: () =>
    set((s) => ({ categoriesVersion: s.categoriesVersion + 1 })),
  bumpAchievements: () =>
    set((s) => ({ achievementsVersion: s.achievementsVersion + 1 })),
  bumpRewards: () => set((s) => ({ rewardsVersion: s.rewardsVersion + 1 })),
  bumpRedemptions: () =>
    set((s) => ({ redemptionsVersion: s.redemptionsVersion + 1 })),
}));
