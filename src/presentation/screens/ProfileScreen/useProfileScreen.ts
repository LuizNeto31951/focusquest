import { useCallback } from 'react';
import {
  useCurrentUser,
  useUserStats,
  useSkipDay,
  useWeeklyStats,
} from '@/presentation/hooks';

export function useProfileScreen() {
  const { user } = useCurrentUser();
  const { stats } = useUserStats(user?.id);
  const { stats: weeklyStats } = useWeeklyStats(user?.id);
  const skipDay = useSkipDay();

  const triggerSkipDay = useCallback(async () => {
    if (!user) return;
    await skipDay.run({ userId: user.id });
  }, [user, skipDay]);

  return {
    user,
    stats,
    weeklyStats,
    triggerSkipDay,
    skipDayLoading: skipDay.loading,
  };
}
