import { AppDataSource, initializeAppDataSource } from '../config/database';

beforeAll(async () => {
  await initializeAppDataSource();
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});
