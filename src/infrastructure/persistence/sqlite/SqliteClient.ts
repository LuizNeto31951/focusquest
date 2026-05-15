import * as SQLite from 'expo-sqlite';

export type SqliteParam = string | number | null;

export interface SqliteClient {
  exec(sql: string): Promise<void>;
  run(sql: string, ...params: SqliteParam[]): Promise<void>;
  get<T>(sql: string, ...params: SqliteParam[]): Promise<T | null>;
  getAll<T>(sql: string, ...params: SqliteParam[]): Promise<T[]>;
  withTransaction<T>(fn: () => Promise<T>): Promise<T>;
}

class ExpoSqliteClient implements SqliteClient {
  constructor(private readonly db: SQLite.SQLiteDatabase) {}

  async exec(sql: string): Promise<void> {
    await this.db.execAsync(sql);
  }

  async run(sql: string, ...params: SqliteParam[]): Promise<void> {
    await this.db.runAsync(sql, ...params);
  }

  async get<T>(sql: string, ...params: SqliteParam[]): Promise<T | null> {
    const row = await this.db.getFirstAsync<T>(sql, ...params);
    return row ?? null;
  }

  async getAll<T>(sql: string, ...params: SqliteParam[]): Promise<T[]> {
    return this.db.getAllAsync<T>(sql, ...params);
  }

  async withTransaction<T>(fn: () => Promise<T>): Promise<T> {
    let result!: T;
    await this.db.withTransactionAsync(async () => {
      result = await fn();
    });
    return result;
  }
}

export async function openSqliteClient(dbName: string): Promise<SqliteClient> {
  const db = await SQLite.openDatabaseAsync(dbName);
  return new ExpoSqliteClient(db);
}
