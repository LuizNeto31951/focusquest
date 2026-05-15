import { useCallback } from 'react';
import type { StartFocusSessionInput } from '@/application/use-cases/focus';
import type { FocusSession } from '@/domain/entities';
import { useAppDependencies } from '@/presentation/providers';
import { useFocusStore } from '@/presentation/stores';
import { useMutation } from './useMutation';

export function useStartFocusSession() {
  const { startFocusSession } = useAppDependencies();
  const setActiveSession = useFocusStore((s) => s.setActiveSession);

  const fn = useCallback(
    async (input: StartFocusSessionInput): Promise<FocusSession> => {
      const session = await startFocusSession.execute(input);
      setActiveSession(session);
      return session;
    },
    [startFocusSession, setActiveSession],
  );

  return useMutation(fn);
}
