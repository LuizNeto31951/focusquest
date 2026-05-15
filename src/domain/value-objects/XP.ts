import { ValidationError } from '@/shared/errors';

declare const __xpBrand: unique symbol;
export type XP = number & { readonly [__xpBrand]: 'XP' };

export const XP = {
  zero(): XP {
    return 0 as XP;
  },

  from(value: number): XP {
    if (!Number.isFinite(value) || value < 0) {
      throw new ValidationError(`XP must be a non-negative finite number, got ${value}`);
    }
    return Math.floor(value) as XP;
  },

  add(a: XP, b: XP): XP {
    return (a + b) as XP;
  },

  subtractClamped(a: XP, b: XP): XP {
    const result = a - b;
    return (result < 0 ? 0 : result) as XP;
  },

  compare(a: XP, b: XP): number {
    return a - b;
  },
};
