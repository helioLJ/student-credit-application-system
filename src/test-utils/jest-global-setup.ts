import { initializeAppDataSource } from '../config/database';

export default async (): Promise<void> => {
  await initializeAppDataSource();
};
