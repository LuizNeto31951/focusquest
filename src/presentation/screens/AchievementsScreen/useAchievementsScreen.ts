import { useCallback } from 'react';
import {
  useAchievements,
  useCurrentUser,
  useDeleteCustomAchievement,
} from '@/presentation/hooks';

export function useAchievementsScreen() {
  const { user } = useCurrentUser();
  const { achievements, loading } = useAchievements(user?.id);
  const deleteAchievement = useDeleteCustomAchievement();
  const unlockedCount = achievements.filter((a) => a.unlockedAt).length;

  const remove = useCallback(
    async (code: string) => {
      await deleteAchievement.run({ code });
    },
    [deleteAchievement],
  );

  return {
    achievements,
    loading,
    unlockedCount,
    total: achievements.length,
    remove,
    removing: deleteAchievement.loading,
  };
}
