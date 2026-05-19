import { useCallback, useEffect, useRef, useState } from 'react';
import { UniqueId } from '@/shared/types';
import {
  useActiveFocusSession,
  useAppBlocker,
  useCurrentUser,
  useEndFocusSession,
} from '@/presentation/hooks';

export type PomodoroPhase = 'focus' | 'break' | 'done';

export interface PomodoroState {
  phase: PomodoroPhase;
  cycle: number;
  totalCycles: number;
  remainingSeconds: number;
}

function computePomodoroState(
  secondsElapsed: number,
  focusSec: number,
  breakSec: number,
  totalCycles: number,
): PomodoroState {
  for (let c = 0; c < totalCycles; c++) {
    const cycleOffset = c * (focusSec + breakSec);
    const focusEnd = cycleOffset + focusSec;
    const breakEnd = focusEnd + breakSec;

    if (secondsElapsed < focusEnd) {
      return { phase: 'focus', cycle: c + 1, totalCycles, remainingSeconds: focusEnd - secondsElapsed };
    }
    if (c < totalCycles - 1 && secondsElapsed < breakEnd) {
      return { phase: 'break', cycle: c + 1, totalCycles, remainingSeconds: breakEnd - secondsElapsed };
    }
  }
  return { phase: 'done', cycle: totalCycles, totalCycles, remainingSeconds: 0 };
}

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function useFocusActiveScreen(sessionIdParam: string) {
  const sessionId = UniqueId.from(sessionIdParam);
  const { user } = useCurrentUser();
  const { activeSession, refetch } = useActiveFocusSession(user?.id);
  const endSession = useEndFocusSession();
  const blocker = useAppBlocker();
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const lastPhaseRef = useRef<PomodoroPhase | null>(null);

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

  const pomodoroState: PomodoroState | null =
    activeSession?.pomodoroCycles && activeSession.pomodoroCycles > 1
      ? computePomodoroState(
          secondsElapsed,
          activeSession.plannedDurationMinutes * 60,
          (activeSession.pomodoroBreakMinutes ?? 5) * 60,
          activeSession.pomodoroCycles,
        )
      : null;

  // Update notification when Pomodoro phase changes.
  useEffect(() => {
    if (!pomodoroState || !blocker.isSupported) return;
    if (lastPhaseRef.current === pomodoroState.phase) return;
    lastPhaseRef.current = pomodoroState.phase;

    const phase = pomodoroState.phase;
    if (phase === 'done') return;

    const title =
      phase === 'focus'
        ? `Ciclo ${pomodoroState.cycle}/${pomodoroState.totalCycles} — Modo foco`
        : `Ciclo ${pomodoroState.cycle}/${pomodoroState.totalCycles} — Pausa`;
    const text =
      phase === 'focus'
        ? `${formatTime(pomodoroState.remainingSeconds)} restantes de foco.`
        : `${formatTime(pomodoroState.remainingSeconds)} de descanso. Aproveite!`;

    blocker.updateFocusNotification(title, text).catch(() => {});
  }, [pomodoroState?.phase, pomodoroState?.cycle, blocker]);

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

  const remainingSeconds = pomodoroState
    ? pomodoroState.remainingSeconds
    : Math.max(0, plannedSeconds - secondsElapsed);

  const finished = pomodoroState
    ? pomodoroState.phase === 'done'
    : secondsElapsed >= plannedSeconds && plannedSeconds > 0;

  return {
    activeSession,
    secondsElapsed,
    remainingSeconds,
    plannedSeconds,
    pomodoroState,
    finished,
    stop,
    loading: endSession.loading,
  };
}
