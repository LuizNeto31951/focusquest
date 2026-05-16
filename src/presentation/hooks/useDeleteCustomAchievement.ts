import { useCallback } from 'react';
import type { DeleteCustomAchievementInput } from '@/application/use-cases/gamification';
import { useAppDependencies } from '@/presentation/providers';
import { useInvalidationStore } from '@/presentation/stores';
import { useMutation } from './useMutation';

export function useDeleteCustomAchievement() {
  const { deleteCustomAchievement } = useAppDependencies();
  const bumpAchievements = useInvalidationStore((s) => s.bumpAchievements);

  const fn = useCallback(
    async (input: DeleteCustomAchievementInput): Promise<void> => {
      await deleteCustomAchievement.execute(input);
      bumpAchievements();
    },
    [deleteCustomAchievement, bumpAchievements],
  );

  return useMutation(fn);
}
