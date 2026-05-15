import { create } from 'zustand';
import type { User } from '@/domain/entities';
import type { UserStats } from '@/application/use-cases/user';

interface UserState {
  user: User | null;
  stats: UserStats | null;
  setUser: (user: User | null) => void;
  setStats: (stats: UserStats | null) => void;
  reset: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  stats: null,
  setUser: (user) => set({ user }),
  setStats: (stats) => set({ stats }),
  reset: () => set({ user: null, stats: null }),
}));
