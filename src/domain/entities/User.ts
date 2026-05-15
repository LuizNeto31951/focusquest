import { ValidationError } from '@/shared/errors';
import type { UniqueId, ISODate } from '@/shared/types';
import { XP, Streak } from '@/domain/value-objects';

export interface User {
  readonly id: UniqueId;
  readonly name: string;
  readonly totalXP: XP;
  readonly streak: Streak;
  readonly createdAt: ISODate;
  readonly updatedAt: ISODate;
}

export interface CreateUserProps {
  id: UniqueId;
  name: string;
  now: ISODate;
}

export function createUser(props: CreateUserProps): User {
  const name = props.name.trim();
  if (name.length === 0) {
    throw new ValidationError('User name cannot be empty');
  }
  return {
    id: props.id,
    name,
    totalXP: XP.zero(),
    streak: Streak.initial(),
    createdAt: props.now,
    updatedAt: props.now,
  };
}

export function renameUser(user: User, newName: string, now: ISODate): User {
  const name = newName.trim();
  if (name.length === 0) {
    throw new ValidationError('User name cannot be empty');
  }
  return { ...user, name, updatedAt: now };
}

export function awardXP(user: User, amount: XP, now: ISODate): User {
  return {
    ...user,
    totalXP: XP.add(user.totalXP, amount),
    updatedAt: now,
  };
}

export function setStreak(user: User, streak: Streak, now: ISODate): User {
  return { ...user, streak, updatedAt: now };
}
