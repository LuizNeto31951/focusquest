import type { ISODate } from '@/shared/types';

export interface Streak {
  readonly current: number;
  readonly longest: number;
  readonly lastActiveDate?: ISODate;
}

export const Streak = {
  initial(): Streak {
    return { current: 0, longest: 0 };
  },
};
