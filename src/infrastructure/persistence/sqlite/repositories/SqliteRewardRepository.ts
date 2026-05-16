import type { UniqueId } from '@/shared/types';
import type { Reward } from '@/domain/entities';
import type { RewardRepository } from '@/domain/repositories';
import type { SqliteClient } from '../SqliteClient';
import { RewardMapper, type RewardRow } from '../mappers';

export class SqliteRewardRepository implements RewardRepository {
  constructor(private readonly client: SqliteClient) {}

  async findAll(): Promise<Reward[]> {
    const rows = await this.client.getAll<RewardRow>(
      `SELECT * FROM rewards
       ORDER BY is_favorite DESC, category ASC, cost ASC, name ASC`,
    );
    return rows.map(RewardMapper.toDomain);
  }

  async findById(id: UniqueId): Promise<Reward | null> {
    const row = await this.client.get<RewardRow>(
      'SELECT * FROM rewards WHERE id = ?',
      id,
    );
    return row ? RewardMapper.toDomain(row) : null;
  }

  async save(reward: Reward): Promise<void> {
    const r = RewardMapper.toRow(reward);
    await this.client.run(
      `INSERT INTO rewards (
        id, name, description, icon_key, color, image_uri,
        cost, category, is_favorite, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        description = excluded.description,
        icon_key = excluded.icon_key,
        color = excluded.color,
        image_uri = excluded.image_uri,
        cost = excluded.cost,
        category = excluded.category,
        is_favorite = excluded.is_favorite,
        updated_at = excluded.updated_at`,
      r.id,
      r.name,
      r.description,
      r.icon_key,
      r.color,
      r.image_uri,
      r.cost,
      r.category,
      r.is_favorite,
      r.created_at,
      r.updated_at,
    );
  }

  async delete(id: UniqueId): Promise<void> {
    await this.client.run('DELETE FROM rewards WHERE id = ?', id);
  }
}
