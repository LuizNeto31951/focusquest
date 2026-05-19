import { useCallback, useState } from 'react';
import {
  useActiveFocusSession,
  useAppBlocker,
  useCurrentUser,
  useStartFocusSession,
} from '@/presentation/hooks';
import { useBlockedAppsStore } from '@/presentation/stores';

const DEFAULT_DURATIONS_MIN = [15, 25, 45, 60];
const POMODORO_CYCLE_OPTIONS = [1, 2, 3] as const;
const POMODORO_BREAK_OPTIONS = [5, 10, 20] as const;

export function useFocusScreen() {
  const { user } = useCurrentUser();
  const { activeSession, refetch } = useActiveFocusSession(user?.id);
  const startSession = useStartFocusSession();
  const [selectedDuration, setSelectedDuration] = useState<number>(25);
  const [pomodoroCycles, setPomodoroCycles] = useState<number>(1);
  const [pomodoroBreakMinutes, setPomodoroBreakMinutes] = useState<number>(5);
  const blockedPackages = useBlockedAppsStore((s) => s.selectedPackages);
  const blocker = useAppBlocker();

  const pomodoroEnabled = pomodoroCycles > 1;

  const start = useCallback(async () => {
    if (!user) return null;
    const session = await startSession.run({
      userId: user.id,
      plannedDurationMinutes: selectedDuration,
      blockedAppPackages: blockedPackages,
      pomodoroCycles: pomodoroEnabled ? pomodoroCycles : undefined,
      pomodoroBreakMinutes: pomodoroEnabled ? pomodoroBreakMinutes : undefined,
    });
    refetch();
    return session;
  }, [user, startSession, selectedDuration, blockedPackages, pomodoroCycles, pomodoroBreakMinutes, pomodoroEnabled, refetch]);

  return {
    user,
    activeSession,
    durations: DEFAULT_DURATIONS_MIN,
    selectedDuration,
    setSelectedDuration,
    pomodoroCycleOptions: POMODORO_CYCLE_OPTIONS,
    pomodoroCycles,
    setPomodoroCycles,
    pomodoroBreakOptions: POMODORO_BREAK_OPTIONS,
    pomodoroBreakMinutes,
    setPomodoroBreakMinutes,
    pomodoroEnabled,
    start,
    loading: startSession.loading,
    error: startSession.error,
    blockedCount: blockedPackages.length,
    blockerSupported: blocker.supported,
    blockerReady: blocker.hasUsageAccess && blocker.hasOverlay,
  };
}
