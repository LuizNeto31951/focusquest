import { UniqueId, ISODate } from '@/shared/types';
import type { Reward } from '@/domain/entities';

export interface RewardRow {
  id: string;
  name: string;
  description: string;
  icon_key: string;
  color: string;
  image_uri: string | null;
  cost: number;
  category: string;
  is_favorite: number;
  created_at: string;
  updated_at: string;
}

export const RewardMapper = {
  toRow(reward: Reward): RewardRow {
    return {
      id: reward.id,
      name: reward.name,
      description: reward.description,
      icon_key: reward.iconKey,
      color: reward.color,
      image_uri: reward.imageUri ?? null,
      cost: reward.cost,
      category: reward.category,
      is_favorite: reward.isFavorite ? 1 : 0,
      created_at: reward.createdAt,
      updated_at: reward.updatedAt,
    };
  },

  toDomain(row: RewardRow): Reward {
    return {
      id: UniqueId.from(row.id),
      name: row.name,
      description: row.description ?? '',
      iconKey: row.icon_key,
      color: row.color,
      imageUri: row.image_uri ?? undefined,
      cost: row.cost,
      category: row.category ?? 'Geral',
      isFavorite: row.is_favorite === 1,
      createdAt: ISODate.from(row.created_at),
      updatedAt: ISODate.from(row.updated_at),
    };
  },
};
