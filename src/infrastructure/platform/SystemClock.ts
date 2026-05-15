import { ISODate } from '@/shared/types';
import type { Clock } from '@/application/ports';

export class SystemClock implements Clock {
  now(): ISODate {
    return ISODate.now();
  }
}
