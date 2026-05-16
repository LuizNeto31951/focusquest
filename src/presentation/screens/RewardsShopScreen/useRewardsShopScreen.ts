import { useCallback, useMemo, useState } from 'react';
import type { Reward } from '@/domain/entities';
import {
  useCurrentUser,
  useRewards,
  useRedeemReward,
  useShopStats,
  useUpdateReward,
} from '@/presentation/hooks';

export function useRewardsShopScreen() {
  const { user, refetch: refetchUser } = useCurrentUser();
  const { rewards, loading } = useRewards();
  const { stats } = useShopStats(user?.id);
  const redeem = useRedeemReward();
  const update = useUpdateReward();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [lastRedeemed, setLastRedeemed] = useState<Reward | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    rewards.forEach((r) => set.add(r.category || 'Geral'));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [rewards]);

  const filtered = useMemo(() => {
    if (!activeCategory) return rewards;
    return rewards.filter((r) => (r.category || 'Geral') === activeCategory);
  }, [rewards, activeCategory]);

  const coins = stats?.coins ?? user?.coins ?? 0;

  const onRedeem = useCallback(
    async (reward: Reward) => {
      if (!user) return;
      const result = await redeem.run({ userId: user.id, rewardId: reward.id });
      setLastRedeemed(result.reward);
      await refetchUser();
    },
    [redeem, user, refetchUser],
  );

  const onToggleFavorite = useCallback(
    async (reward: Reward) => {
      await update.run({ id: reward.id, isFavorite: !reward.isFavorite });
    },
    [update],
  );

  const dismissLastRedeemed = useCallback(() => setLastRedeemed(null), []);

  return {
    user,
    coins,
    stats,
    rewards: filtered,
    allRewards: rewards,
    loading,
    categories,
    activeCategory,
    setActiveCategory,
    onRedeem,
    onToggleFavorite,
    redeeming: redeem.loading,
    redeemError: redeem.error,
    lastRedeemed,
    dismissLastRedeemed,
  };
}
