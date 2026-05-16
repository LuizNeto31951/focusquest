import { useCallback } from 'react';
import type { CreateCustomAchievementInput } from '@/application/use-cases/gamification';
import type { Achievement } from '@/domain/entities';
import { useAppDependencies } from '@/presentation/providers';
import { useInvalidationStore } from '@/presentation/stores';
import { useMutation } from './useMutation';

export function useCreateCustomAchievement() {
  const { createCustomAchievement } = useAppDependencies();
  const bumpAchievements = useInvalidationStore((s) => s.bumpAchievements);

  const fn = useCallback(
    async (input: CreateCustomAchievementInput): Promise<Achievement> => {
      const achievement = await createCustomAchievement.execute(input);
      bumpAchievements();
      return achievement;
    },
    [createCustomAchievement, bumpAchievements],
  );

  return useMutation(fn);
}
