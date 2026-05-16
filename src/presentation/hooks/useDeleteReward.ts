import { useCallback } from 'react';
import type { DeleteRewardInput } from '@/application/use-cases/shop';
import { useAppDependencies } from '@/presentation/providers';
import { useInvalidationStore } from '@/presentation/stores';
import { useMutation } from './useMutation';

export function useDeleteReward() {
  const { deleteReward } = useAppDependencies();
  const bumpRewards = useInvalidationStore((s) => s.bumpRewards);

  const fn = useCallback(
    async (input: DeleteRewardInput): Promise<void> => {
      await deleteReward.execute(input);
      bumpRewards();
    },
    [deleteReward, bumpRewards],
  );

  return useMutation(fn);
}
