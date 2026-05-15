import { ValidationError } from '@/shared/errors';

declare const __durationBrand: unique symbol;
export type DurationMinutes = number & { readonly [__durationBrand]: 'DurationMinutes' };

export const DurationMinutes = {
  zero(): DurationMinutes {
    return 0 as DurationMinutes;
  },

  from(minutes: number): DurationMinutes {
    if (!Number.isInteger(minutes) || minutes < 0) {
      throw new ValidationError(
        `DurationMinutes must be a non-negative integer, got ${minutes}`,
      );
    }
    return minutes as DurationMinutes;
  },
};
