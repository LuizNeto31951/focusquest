import { useCallback, useEffect, useState } from 'react';
import { UniqueId } from '@/shared/types';
import {
  useActiveFocusSession,
  useCurrentUser,
  useEndFocusSession,
} from '@/presentation/hooks';

export function useFocusActiveScreen(sessionIdParam: string) {
  const sessionId = UniqueId.from(sessionIdParam);
  const { user } = useCurrentUser();
  const { activeSession, refetch } = useActiveFocusSession(user?.id);
  const endSession = useEndFocusSession();
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    if (!activeSession) return;
    const start = new Date(activeSession.startedAt).getTime();
    const tick = () => {
      setSecondsElapsed(Math.max(0, Math.floor((Date.now() - start) / 1000)));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [activeSession]);

  const stop = useCallback(
    async (wasInterrupted: boolean) => {
      await endSession.run({ sessionId, wasInterrupted });
      refetch();
    },
    [endSession, sessionId, refetch],
  );

  const plannedSeconds = activeSession
    ? activeSession.plannedDurationMinutes * 60
    : 0;
  const remaining = Math.max(0, plannedSeconds - secondsElapsed);

  return {
    activeSession,
    secondsElapsed,
    remainingSeconds: remaining,
    plannedSeconds,
    stop,
    loading: endSession.loading,
  };
}
