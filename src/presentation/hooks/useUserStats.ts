import { useMemo } from 'react';
import type { UniqueId } from '@/shared/types';
import type { UserStats } from '@/application/use-cases/user';
import { LevelCalculator } from '@/domain/services';
import { useUserStore } from '@/presentation/stores';

export function useUserStats(_userId?: UniqueId) {
  const user = useUserStore((s) => s.user);

  const stats = useMemo<UserStats | null>(() => {
    if (!user) return null;
    return {
      userId: user.id,
      name: user.name,
      totalXP: user.totalXP,
      level: LevelCalculator.levelFromTotalXP(user.totalXP),
      xpRemainingToNextLevel: LevelCalculator.xpRemainingToNextLevel(user.totalXP),
      progressInCurrentLevel: LevelCalculator.progressInCurrentLevel(user.totalXP),
      currentStreakDays: user.streak.current,
      longestStreakDays: user.streak.longest,
    };
  }, [user]);

  return {
    stats,
    loading: false,
    error: null as Error | null,
    refetch: async () => {},
  };
}
