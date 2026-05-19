import { useCallback } from 'react';
import type { CreateCustomAchievementInput } from '@/application/use-cases/gamification';
import type { Achievement } from '@/domain/entities';
import { useAppDependencies } from '@/presentation/providers';
import { useInvalidationStore, useUserStore } from '@/presentation/stores';
import { useMutation } from './useMutation';

type InputWithoutUserId = Omit<CreateCustomAchievementInput, 'userId'>;

export function useCreateCustomAchievement() {
  const { createCustomAchievement } = useAppDependencies();
  const bumpAchievements = useInvalidationStore((s) => s.bumpAchievements);
  const user = useUserStore((s) => s.user);

  const fn = useCallback(
    async (input: InputWithoutUserId): Promise<Achievement> => {
      if (!user) throw new Error('Usuário não encontrado');
      const achievement = await createCustomAchievement.execute({ ...input, userId: user.id });
      bumpAchievements();
      return achievement;
    },
    [createCustomAchievement, bumpAchievements, user],
  );

  return useMutation(fn);
}
