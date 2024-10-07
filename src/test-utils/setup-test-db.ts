import { AppDataSource } from '../config/database';

export async function setupTestDatabase() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  await clearDatabase();
}

export async function teardownTestDatabase() {
  await clearDatabase();
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
}

async function clearDatabase() {
  const entities = AppDataSource.entityMetadatas;
  for (const entity of entities) {
    const repository = AppDataSource.getRepository(entity.name);
    await repository.query(`TRUNCATE "${entity.tableName}" RESTART IDENTITY CASCADE;`);
  }
}