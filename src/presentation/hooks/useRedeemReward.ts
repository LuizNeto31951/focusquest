import { useCallback } from 'react';
import type {
  RedeemRewardInput,
  RedeemRewardOutput,
} from '@/application/use-cases/shop';
import { useAppDependencies } from '@/presentation/providers';
import { useInvalidationStore } from '@/presentation/stores';
import { useMutation } from './useMutation';

export function useRedeemReward() {
  const { redeemReward } = useAppDependencies();
  const bumpRedemptions = useInvalidationStore((s) => s.bumpRedemptions);

  const fn = useCallback(
    async (input: RedeemRewardInput): Promise<RedeemRewardOutput> => {
      const result = await redeemReward.execute(input);
      bumpRedemptions();
      return result;
    },
    [redeemReward, bumpRedemptions],
  );

  return useMutation(fn);
}
