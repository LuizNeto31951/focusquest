import { useCallback, useState } from 'react';
import {
  useActiveFocusSession,
  useCurrentUser,
  useStartFocusSession,
} from '@/presentation/hooks';

const DEFAULT_DURATIONS_MIN = [15, 25, 45, 60];

export function useFocusScreen() {
  const { user } = useCurrentUser();
  const { activeSession, refetch } = useActiveFocusSession(user?.id);
  const startSession = useStartFocusSession();
  const [selectedDuration, setSelectedDuration] = useState<number>(25);

  const start = useCallback(async () => {
    if (!user) return null;
    const session = await startSession.run({
      userId: user.id,
      plannedDurationMinutes: selectedDuration,
    });
    refetch();
    return session;
  }, [user, startSession, selectedDuration, refetch]);

  return {
    user,
    activeSession,
    durations: DEFAULT_DURATIONS_MIN,
    selectedDuration,
    setSelectedDuration,
    start,
    loading: startSession.loading,
    error: startSession.error,
  };
}
