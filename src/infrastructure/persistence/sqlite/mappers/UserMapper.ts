import { UniqueId, ISODate } from '@/shared/types';
import { XP } from '@/domain/value-objects';
import type { User } from '@/domain/entities';
import type { Streak } from '@/domain/value-objects';

export interface UserRow {
  id: string;
  name: string;
  avatar_uri: string | null;
  total_xp: number;
  streak_current: number;
  streak_longest: number;
  streak_last_active_date: string | null;
  coins: number | null;
  created_at: string;
  updated_at: string;
}

export const UserMapper = {
  toRow(user: User): UserRow {
    return {
      id: user.id,
      name: user.name,
      avatar_uri: user.avatarUri ?? null,
      total_xp: user.totalXP,
      streak_current: user.streak.current,
      streak_longest: user.streak.longest,
      streak_last_active_date: user.streak.lastActiveDate ?? null,
      coins: user.coins,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };
  },

  toDomain(row: UserRow): User {
    const streak: Streak = {
      current: row.streak_current,
      longest: row.streak_longest,
      lastActiveDate: row.streak_last_active_date
        ? ISODate.from(row.streak_last_active_date)
        : undefined,
    };

    return {
      id: UniqueId.from(row.id),
      name: row.name,
      avatarUri: row.avatar_uri ?? undefined,
      totalXP: XP.from(row.total_xp),
      streak,
      coins: Math.max(0, Math.floor(row.coins ?? 0)),
      createdAt: ISODate.from(row.created_at),
      updatedAt: ISODate.from(row.updated_at),
    };
  },
};
