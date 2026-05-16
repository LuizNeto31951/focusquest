import { useCallback } from 'react';
import type { UpdateUserProfileInput } from '@/application/use-cases/user';
import type { User } from '@/domain/entities';
import { useAppDependencies } from '@/presentation/providers';
import { useUserStore } from '@/presentation/stores';
import { useMutation } from './useMutation';

export function useUpdateUserProfile() {
  const { updateUserProfile } = useAppDependencies();
  const setUser = useUserStore((s) => s.setUser);

  const fn = useCallback(
    async (input: UpdateUserProfileInput): Promise<User> => {
      const user = await updateUserProfile.execute(input);
      setUser(user);
      return user;
    },
    [updateUserProfile, setUser],
  );

  return useMutation(fn);
}
