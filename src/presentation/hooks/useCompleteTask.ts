import { useCallback } from 'react';
import type {
  CompleteTaskInput,
  CompleteTaskOutput,
} from '@/application/use-cases/tasks';
import { LevelCalculator } from '@/domain/services';
import { useAppDependencies } from '@/presentation/providers';
import {
  useFeedbackStore,
  useTasksStore,
  useUserStore,
} from '@/presentation/stores';
import { useMutation } from './useMutation';

export function useCompleteTask() {
  const { completeTask } = useAppDependencies();
  const upsertTask = useTasksStore((s) => s.upsertTask);
  const currentUser = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const pushXPAward = useFeedbackStore((s) => s.pushXPAward);
  const pushLevelUp = useFeedbackStore((s) => s.pushLevelUp);
  const pushAchievements = useFeedbackStore((s) => s.pushAchievements);

  const fn = useCallback(
    async (input: CompleteTaskInput): Promise<CompleteTaskOutput> => {
      const previousXP = currentUser?.totalXP;
      const output = await completeTask.execute(input);

      upsertTask(output.task);
      setUser(output.user);

      if (output.xpAwarded > 0) {
        pushXPAward({
          id: output.task.id,
          amount: output.xpAwarded,
          breakdown: output.breakdown,
        });
      }

      if (previousXP !== undefined) {
        if (LevelCalculator.hasLeveledUp(previousXP, output.user.totalXP)) {
          pushLevelUp({
            id: output.task.id,
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
      completeTask,
      upsertTask,
      setUser,
      currentUser,
      pushXPAward,
      pushLevelUp,
      pushAchievements,
    ],
  );

  return useMutation(fn);
}
