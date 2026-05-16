import { ValidationError } from '@/shared/errors';
import type { UniqueId, ISODate } from '@/shared/types';

export interface Reward {
  readonly id: UniqueId;
  readonly name: string;
  readonly description: string;
  readonly iconKey: string;
  readonly color: string;
  readonly imageUri?: string;
  readonly cost: number;
  readonly category: string;
  readonly isFavorite: boolean;
  readonly createdAt: ISODate;
  readonly updatedAt: ISODate;
}

export interface CreateRewardProps {
  id: UniqueId;
  name: string;
  description?: string;
  iconKey: string;
  color: string;
  imageUri?: string;
  cost: number;
  category?: string;
  now: ISODate;
}

export function createReward(props: CreateRewardProps): Reward {
  const name = props.name.trim();
  if (name.length === 0) {
    throw new ValidationError('Nome da recompensa é obrigatório');
  }
  if (!Number.isFinite(props.cost) || props.cost < 1) {
    throw new ValidationError('Preço deve ser >= 1');
  }
  return {
    id: props.id,
    name,
    description: (props.description ?? '').trim(),
    iconKey: props.iconKey,
    color: props.color,
    imageUri: props.imageUri,
    cost: Math.floor(props.cost),
    category: (props.category ?? 'Geral').trim() || 'Geral',
    isFavorite: false,
    createdAt: props.now,
    updatedAt: props.now,
  };
}

export interface UpdateRewardProps {
  name?: string;
  description?: string;
  iconKey?: string;
  color?: string;
  imageUri?: string | null;
  cost?: number;
  category?: string;
  isFavorite?: boolean;
}

export function updateReward(
  reward: Reward,
  props: UpdateRewardProps,
  now: ISODate,
): Reward {
  let name = reward.name;
  if (props.name !== undefined) {
    const trimmed = props.name.trim();
    if (trimmed.length === 0) {
      throw new ValidationError('Nome da recompensa é obrigatório');
    }
    name = trimmed;
  }

  let cost = reward.cost;
  if (props.cost !== undefined) {
    if (!Number.isFinite(props.cost) || props.cost < 1) {
      throw new ValidationError('Preço deve ser >= 1');
    }
    cost = Math.floor(props.cost);
  }

  return {
    ...reward,
    name,
    description:
      props.description !== undefined
        ? props.description.trim()
        : reward.description,
    iconKey: props.iconKey ?? reward.iconKey,
    color: props.color ?? reward.color,
    imageUri:
      props.imageUri === undefined
        ? reward.imageUri
        : props.imageUri === null
          ? undefined
          : props.imageUri,
    cost,
    category:
      props.category !== undefined
        ? props.category.trim() || 'Geral'
        : reward.category,
    isFavorite: props.isFavorite ?? reward.isFavorite,
    updatedAt: now,
  };
}
