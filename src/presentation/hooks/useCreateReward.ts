import { useCallback } from 'react';
import type { CreateRewardInput } from '@/application/use-cases/shop';
import type { Reward } from '@/domain/entities';
import { useAppDependencies } from '@/presentation/providers';
import { useInvalidationStore } from '@/presentation/stores';
import { useMutation } from './useMutation';

export function useCreateReward() {
  const { createReward } = useAppDependencies();
  const bumpRewards = useInvalidationStore((s) => s.bumpRewards);

  const fn = useCallback(
    async (input: CreateRewardInput): Promise<Reward> => {
      const reward = await createReward.execute(input);
      bumpRewards();
      return reward;
    },
    [createReward, bumpRewards],
  );

  return useMutation(fn);
}
