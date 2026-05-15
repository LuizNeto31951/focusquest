import type { UniqueId } from '@/shared/types';
import type { Category } from '@/domain/entities';
import type { CategoryRepository } from '@/domain/repositories';
import type { SqliteClient } from '../SqliteClient';
import { CategoryMapper, type CategoryRow } from '../mappers';

export class SqliteCategoryRepository implements CategoryRepository {
  constructor(private readonly client: SqliteClient) {}

  async findAll(): Promise<Category[]> {
    const rows = await this.client.getAll<CategoryRow>(
      'SELECT * FROM categories ORDER BY is_default DESC, name ASC',
    );
    return rows.map(CategoryMapper.toDomain);
  }

  async findById(id: UniqueId): Promise<Category | null> {
    const row = await this.client.get<CategoryRow>(
      'SELECT * FROM categories WHERE id = ?',
      id,
    );
    return row ? CategoryMapper.toDomain(row) : null;
  }

  async save(category: Category): Promise<void> {
    const r = CategoryMapper.toRow(category);
    await this.client.run(
      `INSERT INTO categories (id, name, color, icon, is_default)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         name = excluded.name,
         color = excluded.color,
         icon = excluded.icon,
         is_default = excluded.is_default`,
      r.id,
      r.name,
      r.color,
      r.icon,
      r.is_default,
    );
  }

  async delete(id: UniqueId): Promise<void> {
    await this.client.run('DELETE FROM categories WHERE id = ?', id);
  }
}
