import { ValidationError } from '@/shared/errors';
import { generateUuid, isValidUuid } from '@/shared/utils/uuid';

declare const __uniqueIdBrand: unique symbol;
export type UniqueId = string & { readonly [__uniqueIdBrand]: 'UniqueId' };

export const UniqueId = {
  generate(): UniqueId {
    return generateUuid() as UniqueId;
  },

  from(value: string): UniqueId {
    if (!isValidUuid(value)) {
      throw new ValidationError(`Invalid UniqueId: "${value}"`);
    }
    return value as UniqueId;
  },

  equals(a: UniqueId, b: UniqueId): boolean {
    return a === b;
  },
};
