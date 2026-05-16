import type { SqliteClient } from './SqliteClient';
import { openSqliteClient } from './SqliteClient';
import { SCHEMA_SQL, SOFT_MIGRATIONS } from './schema';
import {
  SqliteCategoryRepository,
  SqliteAchievementRepository,
} from './repositories';
import { DEFAULT_CATEGORIES, DEFAULT_ACHIEVEMENTS } from '../seed';

export const DATABASE_NAME = 'focusquest.db';

export interface InitializedDatabase {
  client: SqliteClient;
}

export async function initializeDatabase(
  dbName: string = DATABASE_NAME,
): Promise<InitializedDatabase> {
  const client = await openSqliteClient(dbName);
  await client.exec(SCHEMA_SQL);
  await runSoftMigrations(client);
  await seedDefaultData(client);
  return { client };
}

async function runSoftMigrations(client: SqliteClient): Promise<void> {
  for (const sql of SOFT_MIGRATIONS) {
    try {
      await client.exec(sql);
    } catch {
      // coluna/tabela já existe — ignorar
    }
  }
}

async function seedDefaultData(client: SqliteClient): Promise<void> {
  const categoryRepo = new SqliteCategoryRepository(client);
  for (const category of DEFAULT_CATEGORIES) {
    await categoryRepo.save(category);
  }

  const achievementRepo = new SqliteAchievementRepository(client);
  for (const achievement of DEFAULT_ACHIEVEMENTS) {
    const existing = await achievementRepo.findByCode(achievement.code);
    if (!existing) {
      await achievementRepo.save(achievement);
    }
  }
}
