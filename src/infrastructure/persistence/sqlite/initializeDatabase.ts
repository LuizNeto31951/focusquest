import type { SqliteClient } from './SqliteClient';
import { openSqliteClient } from './SqliteClient';
import { SCHEMA_SQL } from './schema';
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
  await seedDefaultData(client);
  return { client };
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
      await client.run(
        `INSERT INTO achievements (code, name, description, icon_name, requirement)
         VALUES (?, ?, ?, ?, ?)`,
        achievement.code,
        achievement.name,
        achievement.description,
        achievement.iconName,
        JSON.stringify(achievement.requirement),
      );
    }
  }
}
