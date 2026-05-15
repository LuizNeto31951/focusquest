import type { ISODate } from '@/shared/types';
import type { RecurrenceRule, Weekday } from '@/domain/value-objects';
import { daysBetween, startOfDay } from '@/shared/utils/dates';

export const RecurrenceMatcher = {
  matches(
    rule: RecurrenceRule,
    taskCreatedAt: ISODate,
    day: ISODate,
  ): boolean {
    const created = startOfDay(new Date(taskCreatedAt));
    const target = startOfDay(new Date(day));

    if (target.getTime() < created.getTime()) return false;

    switch (rule.frequency) {
      case 'DAILY':
        return true;
      case 'WEEKLY':
        return rule.weekdays.includes(target.getDay() as Weekday);
      case 'CUSTOM': {
        const diff = daysBetween(created, target);
        return diff >= 0 && diff % rule.intervalDays === 0;
      }
    }
  },
};
