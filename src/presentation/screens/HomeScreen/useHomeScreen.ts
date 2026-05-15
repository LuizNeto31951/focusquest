import { useMemo } from 'react';
import { useCurrentUser, useUserStats, useTasks } from '@/presentation/hooks';
import { ISODate } from '@/shared/types';
import type { ListTasksInput } from '@/application/use-cases/tasks';

export function useHomeScreen() {
  const { user } = useCurrentUser();
  const { stats } = useUserStats(user?.id);

  const tasksInput = useMemo<ListTasksInput>(
    () => ({
      userId: user?.id ?? ('' as never),
      onlyPending: true,
      dueOnDay: ISODate.now(),
      onlyTopLevel: true,
    }),
    [user?.id],
  );

  const { tasks, refetch } = useTasks(tasksInput);

  return {
    user,
    stats,
    pendingTasksToday: user ? tasks : [],
    refetchTasks: refetch,
  };
}
