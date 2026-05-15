import { create } from 'zustand';
import type { FocusSession } from '@/domain/entities';

interface FocusState {
  activeSession: FocusSession | null;
  setActiveSession: (session: FocusSession | null) => void;
}

export const useFocusStore = create<FocusState>((set) => ({
  activeSession: null,
  setActiveSession: (session) => set({ activeSession: session }),
}));
