import { useCallback } from 'react';
import type { UpdateRewardInput } from '@/application/use-cases/shop';
import type { Reward } from '@/domain/entities';
import { useAppDependencies } from '@/presentation/providers';
import { useInvalidationStore } from '@/presentation/stores';
import { useMutation } from './useMutation';

export function useUpdateReward() {
  const { updateReward } = useAppDependencies();
  const bumpRewards = useInvalidationStore((s) => s.bumpRewards);

  const fn = useCallback(
    async (input: UpdateRewardInput): Promise<Reward> => {
      const reward = await updateReward.execute(input);
      bumpRewards();
      return reward;
    },
    [updateReward, bumpRewards],
  );

  return useMutation(fn);
}
