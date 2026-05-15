import { ValidationError } from '@/shared/errors';

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const ALL_WEEKDAYS: readonly Weekday[] = [0, 1, 2, 3, 4, 5, 6];

export type RecurrenceRule =
  | { readonly frequency: 'DAILY' }
  | { readonly frequency: 'WEEKLY'; readonly weekdays: readonly Weekday[] }
  | { readonly frequency: 'CUSTOM'; readonly intervalDays: number };

export const RecurrenceRule = {
  daily(): RecurrenceRule {
    return { frequency: 'DAILY' };
  },

  weekly(weekdays: readonly Weekday[]): RecurrenceRule {
    if (weekdays.length === 0) {
      throw new ValidationError('Weekly recurrence requires at least one weekday');
    }
    return { frequency: 'WEEKLY', weekdays };
  },

  custom(intervalDays: number): RecurrenceRule {
    if (!Number.isInteger(intervalDays) || intervalDays < 1) {
      throw new ValidationError(
        `Custom recurrence interval must be integer >= 1, got ${intervalDays}`,
      );
    }
    return { frequency: 'CUSTOM', intervalDays };
  },
};
