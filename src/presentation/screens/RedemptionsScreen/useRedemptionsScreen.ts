import { useCurrentUser, useRedemptions, useShopStats } from '@/presentation/hooks';

export function useRedemptionsScreen() {
  const { user } = useCurrentUser();
  const { redemptions, loading } = useRedemptions(user?.id, 100);
  const { stats } = useShopStats(user?.id);

  return {
    user,
    redemptions,
    loading,
    stats,
  };
}
