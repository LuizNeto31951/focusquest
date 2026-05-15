import { ValidationError } from '@/shared/errors';

declare const __levelBrand: unique symbol;
export type Level = number & { readonly [__levelBrand]: 'Level' };

export const Level = {
  initial(): Level {
    return 1 as Level;
  },

  from(value: number): Level {
    if (!Number.isInteger(value) || value < 1) {
      throw new ValidationError(`Level must be an integer >= 1, got ${value}`);
    }
    return value as Level;
  },
};
