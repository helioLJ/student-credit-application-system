import { AppDataSource } from '../config/database';

export async function setupTestDatabase(): Promise<void> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  await clearDatabase();
}

export async function teardownTestDatabase(): Promise<void> {
  await clearDatabase();
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
}

async function clearDatabase(): Promise<void> {
  const entities = AppDataSource.entityMetadatas;
  for (const entity of entities) {
    const repository = AppDataSource.getRepository(entity.name);
    await repository.query(`TRUNCATE "${entity.tableName}" RESTART IDENTITY CASCADE;`);
  }
}
