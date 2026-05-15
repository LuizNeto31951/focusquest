import { create } from 'zustand';
import type { Achievement } from '@/domain/entities';
import type { XP } from '@/domain/value-objects';
import type { TaskXPBreakdown } from '@/domain/services';

export interface XPAward {
  id: string;
  amount: XP;
  breakdown: TaskXPBreakdown | null;
}

export interface LevelUpEvent {
  id: string;
  newLevel: number;
}

interface FeedbackState {
  pendingXPAward: XPAward | null;
  pendingLevelUp: LevelUpEvent | null;
  pendingAchievements: Achievement[];

  pushXPAward: (award: XPAward) => void;
  pushLevelUp: (event: LevelUpEvent) => void;
  pushAchievements: (achievements: Achievement[]) => void;

  clearXPAward: () => void;
  clearLevelUp: () => void;
  clearAchievements: () => void;
  popAchievement: () => void;
  clearAll: () => void;
}

export const useFeedbackStore = create<FeedbackState>((set) => ({
  pendingXPAward: null,
  pendingLevelUp: null,
  pendingAchievements: [],

  pushXPAward: (award) => set({ pendingXPAward: award }),
  pushLevelUp: (event) => set({ pendingLevelUp: event }),
  pushAchievements: (achievements) =>
    set((state) => ({
      pendingAchievements: [...state.pendingAchievements, ...achievements],
    })),

  clearXPAward: () => set({ pendingXPAward: null }),
  clearLevelUp: () => set({ pendingLevelUp: null }),
  clearAchievements: () => set({ pendingAchievements: [] }),
  popAchievement: () =>
    set((state) => ({ pendingAchievements: state.pendingAchievements.slice(1) })),
  clearAll: () =>
    set({
      pendingXPAward: null,
      pendingLevelUp: null,
      pendingAchievements: [],
    }),
}));
