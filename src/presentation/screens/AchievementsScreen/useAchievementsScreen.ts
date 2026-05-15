import { useCurrentUser, useAchievements } from '@/presentation/hooks';

export function useAchievementsScreen() {
  const { user } = useCurrentUser();
  const { achievements, loading } = useAchievements(user?.id);
  const unlockedCount = achievements.filter((a) => a.unlockedAt).length;
  return { achievements, loading, unlockedCount, total: achievements.length };
}
