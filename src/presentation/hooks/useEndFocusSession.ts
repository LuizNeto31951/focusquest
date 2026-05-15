import { useCallback } from 'react';
import type {
  EndFocusSessionInput,
  EndFocusSessionOutput,
} from '@/application/use-cases/focus';
import { LevelCalculator } from '@/domain/services';
import { useAppDependencies } from '@/presentation/providers';
import {
  useFeedbackStore,
  useFocusStore,
  useUserStore,
} from '@/presentation/stores';
import { useMutation } from './useMutation';

export function useEndFocusSession() {
  const { endFocusSession } = useAppDependencies();
  const setActiveSession = useFocusStore((s) => s.setActiveSession);
  const currentUser = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const pushXPAward = useFeedbackStore((s) => s.pushXPAward);
  const pushLevelUp = useFeedbackStore((s) => s.pushLevelUp);
  const pushAchievements = useFeedbackStore((s) => s.pushAchievements);

  const fn = useCallback(
    async (input: EndFocusSessionInput): Promise<EndFocusSessionOutput> => {
      const previousXP = currentUser?.totalXP;
      const output = await endFocusSession.execute(input);

      setActiveSession(null);
      setUser(output.user);

      if (output.xpAwarded > 0) {
        pushXPAward({
          id: output.session.id,
          amount: output.xpAwarded,
          breakdown: null,
        });
      }

      if (previousXP !== undefined) {
        if (LevelCalculator.hasLeveledUp(previousXP, output.user.totalXP)) {
          pushLevelUp({
            id: output.session.id,
            newLevel: LevelCalculator.levelFromTotalXP(output.user.totalXP),
          });
        }
      }

      if (output.newlyUnlockedAchievements.length > 0) {
        pushAchievements(output.newlyUnlockedAchievements);
      }

      return output;
    },
    [
      endFocusSession,
      setActiveSession,
      setUser,
      currentUser,
      pushXPAward,
      pushLevelUp,
      pushAchievements,
    ],
  );

  return useMutation(fn);
}
