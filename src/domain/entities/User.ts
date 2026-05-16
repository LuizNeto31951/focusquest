import { ValidationError } from '@/shared/errors';
import type { UniqueId, ISODate } from '@/shared/types';
import { XP, Streak } from '@/domain/value-objects';

export interface User {
  readonly id: UniqueId;
  readonly name: string;
  readonly avatarUri?: string;
  readonly totalXP: XP;
  readonly streak: Streak;
  readonly coins: number;
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
    coins: 0,
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

export function setAvatar(
  user: User,
  avatarUri: string | undefined,
  now: ISODate,
): User {
  return { ...user, avatarUri, updatedAt: now };
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

export function earnCoins(user: User, amount: number, now: ISODate): User {
  const safe = Math.max(0, Math.floor(amount));
  if (safe === 0) return user;
  return { ...user, coins: user.coins + safe, updatedAt: now };
}

export function spendCoins(user: User, amount: number, now: ISODate): User {
  const safe = Math.max(0, Math.floor(amount));
  if (safe === 0) return user;
  if (user.coins < safe) {
    throw new ValidationError('Saldo de moedas insuficiente');
  }
  return { ...user, coins: user.coins - safe, updatedAt: now };
}
