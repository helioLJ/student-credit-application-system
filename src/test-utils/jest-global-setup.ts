import { initializeAppDataSource } from '../config/database';

export default async () => {
  await initializeAppDataSource();
};