import { useCallback } from 'react';
import type { SkipDayInput } from '@/application/use-cases/user';
import type { User } from '@/domain/entities';
import { useAppDependencies } from '@/presentation/providers';
import { useUserStore } from '@/presentation/stores';
import { useMutation } from './useMutation';

export function useSkipDay() {
  const { skipDay } = useAppDependencies();
  const setUser = useUserStore((s) => s.setUser);

  const fn = useCallback(
    async (input: SkipDayInput): Promise<User> => {
      const user = await skipDay.execute(input);
      setUser(user);
      return user;
    },
    [skipDay, setUser],
  );

  return useMutation(fn);
}
