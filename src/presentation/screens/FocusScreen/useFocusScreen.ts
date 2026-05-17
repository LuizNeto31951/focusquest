import { useCallback, useState } from 'react';
import {
  useActiveFocusSession,
  useAppBlocker,
  useCurrentUser,
  useStartFocusSession,
} from '@/presentation/hooks';
import { useBlockedAppsStore } from '@/presentation/stores';

const DEFAULT_DURATIONS_MIN = [15, 25, 45, 60];

export function useFocusScreen() {
  const { user } = useCurrentUser();
  const { activeSession, refetch } = useActiveFocusSession(user?.id);
  const startSession = useStartFocusSession();
  const [selectedDuration, setSelectedDuration] = useState<number>(25);
  const blockedPackages = useBlockedAppsStore((s) => s.selectedPackages);
  const blocker = useAppBlocker();

  const start = useCallback(async () => {
    if (!user) return null;
    const session = await startSession.run({
      userId: user.id,
      plannedDurationMinutes: selectedDuration,
      blockedAppPackages: blockedPackages,
    });
    refetch();
    return session;
  }, [user, startSession, selectedDuration, blockedPackages, refetch]);

  return {
    user,
    activeSession,
    durations: DEFAULT_DURATIONS_MIN,
    selectedDuration,
    setSelectedDuration,
    start,
    loading: startSession.loading,
    error: startSession.error,
    blockedCount: blockedPackages.length,
    blockerSupported: blocker.supported,
    blockerReady: blocker.hasUsageAccess && blocker.hasOverlay,
  };
}
