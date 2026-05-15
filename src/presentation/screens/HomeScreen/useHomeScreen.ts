import { useCurrentUser, useUserStats, useTasks } from '@/presentation/hooks';
import { ISODate } from '@/shared/types';

export function useHomeScreen() {
  const { user } = useCurrentUser();
  const { stats } = useUserStats(user?.id);
  const today = ISODate.now();
  const { tasks, refetch } = useTasks({
    userId: user?.id ?? ('' as never),
    onlyPending: true,
    dueOnDay: today,
    onlyTopLevel: true,
  });

  return {
    user,
    stats,
    pendingTasksToday: user ? tasks : [],
    refetchTasks: refetch,
  };
}
