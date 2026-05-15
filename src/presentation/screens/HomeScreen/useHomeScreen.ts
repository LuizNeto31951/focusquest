import { useMemo } from 'react';
import {
  useCurrentUser,
  useUserStats,
  useTodaysTasks,
} from '@/presentation/hooks';
import { ISODate } from '@/shared/types';

export function useHomeScreen() {
  const { user } = useCurrentUser();
  const { stats } = useUserStats(user?.id);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const today = useMemo(() => ISODate.now(), [user?.id]);
  const { tasks, refetch } = useTodaysTasks(user?.id, today);

  const pending = tasks.filter((entry) => !entry.isCompletedToday);

  return {
    user,
    stats,
    pendingTasksToday: user ? pending : [],
    refetchTasks: refetch,
  };
}
