import type { ISODate } from '@/shared/types';

export interface Clock {
  now(): ISODate;
}
