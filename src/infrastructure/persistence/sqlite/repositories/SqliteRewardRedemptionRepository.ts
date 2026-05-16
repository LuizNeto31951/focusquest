import type { UniqueId } from '@/shared/types';
import type { RewardRedemption } from '@/domain/entities';
import type { RewardRedemptionRepository } from '@/domain/repositories';
import type { SqliteClient } from '../SqliteClient';
import { RewardRedemptionMapper, type RewardRedemptionRow } from '../mappers';

export class SqliteRewardRedemptionRepository
  implements RewardRedemptionRepository
{
  constructor(private readonly client: SqliteClient) {}

  async findByUser(
    userId: UniqueId,
    limit?: number,
  ): Promise<RewardRedemption[]> {
    const max = limit && limit > 0 ? Math.floor(limit) : 200;
    const rows = await this.client.getAll<RewardRedemptionRow>(
      `SELECT * FROM reward_redemptions
       WHERE user_id = ?
       ORDER BY redeemed_at DESC
       LIMIT ?`,
      userId,
      max,
    );
    return rows.map(RewardRedemptionMapper.toDomain);
  }

  async countByUser(userId: UniqueId): Promise<number> {
    const row = await this.client.get<{ total: number }>(
      'SELECT COUNT(*) AS total FROM reward_redemptions WHERE user_id = ?',
      userId,
    );
    return row?.total ?? 0;
  }

  async totalSpentByUser(userId: UniqueId): Promise<number> {
    const row = await this.client.get<{ total: number | null }>(
      'SELECT COALESCE(SUM(cost), 0) AS total FROM reward_redemptions WHERE user_id = ?',
      userId,
    );
    return row?.total ?? 0;
  }

  async save(redemption: RewardRedemption): Promise<void> {
    const r = RewardRedemptionMapper.toRow(redemption);
    await this.client.run(
      `INSERT INTO reward_redemptions (
        id, user_id, reward_id, reward_name, cost, redeemed_at, note
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      r.id,
      r.user_id,
      r.reward_id,
      r.reward_name,
      r.cost,
      r.redeemed_at,
      r.note,
    );
  }

  async deleteById(id: UniqueId): Promise<void> {
    await this.client.run('DELETE FROM reward_redemptions WHERE id = ?', id);
  }
}
