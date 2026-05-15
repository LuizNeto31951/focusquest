import { ISODate } from '@/shared/types';
import { Streak } from '@/domain/value-objects';
import { daysBetween } from '@/shared/utils/dates';

export const StreakCalculator = {
  recordActivity(current: Streak, today: ISODate): Streak {
    const todayDate = ISODate.toDate(today);

    if (!current.lastActiveDate) {
      const updated = 1;
      return {
        current: updated,
        longest: Math.max(current.longest, updated),
        lastActiveDate: today,
      };
    }

    const diffInDays = daysBetween(
      ISODate.toDate(current.lastActiveDate),
      todayDate,
    );

    if (diffInDays === 0) {
      return current;
    }

    if (diffInDays === 1) {
      const updated = current.current + 1;
      return {
        current: updated,
        longest: Math.max(current.longest, updated),
        lastActiveDate: today,
      };
    }

    return {
      current: 1,
      longest: current.longest,
      lastActiveDate: today,
    };
  },

  skipDay(current: Streak, today: ISODate): Streak {
    return { ...current, lastActiveDate: today };
  },
};
