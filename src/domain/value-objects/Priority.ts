export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export const ALL_PRIORITIES: readonly Priority[] = ['LOW', 'MEDIUM', 'HIGH'];

export function priorityOrder(p: Priority): number {
  return { LOW: 0, MEDIUM: 1, HIGH: 2 }[p];
}
