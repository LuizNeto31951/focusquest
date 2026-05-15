import { ValidationError } from '@/shared/errors';

declare const __isoDateBrand: unique symbol;
export type ISODate = string & { readonly [__isoDateBrand]: 'ISODate' };

export const ISODate = {
  now(): ISODate {
    return new Date().toISOString() as ISODate;
  },

  fromDate(date: Date): ISODate {
    if (isNaN(date.getTime())) {
      throw new ValidationError('Cannot convert invalid Date to ISODate');
    }
    return date.toISOString() as ISODate;
  },

  from(value: string): ISODate {
    const d = new Date(value);
    if (isNaN(d.getTime())) {
      throw new ValidationError(`Invalid ISODate: "${value}"`);
    }
    return value as ISODate;
  },

  toDate(iso: ISODate): Date {
    return new Date(iso);
  },
};
