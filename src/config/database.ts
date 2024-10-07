import { DataSource, DataSourceOptions } from "typeorm";
import { SeederOptions } from "typeorm-extension";
import { Student } from '../models/Student';
import { CreditApplication } from '../models/CreditApplication';
import { Admin } from '../models/Admin';
import InitialSeeder from '../seeds/initialSeed';

const dbConfig: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'myapp_user',
  password: process.env.DB_PASSWORD || 'myapp_password',
  database: process.env.DB_NAME || 'myapp_db',
  entities: [Student, CreditApplication, Admin],
  synchronize: false,
  seeds: [InitialSeeder],
  migrations: [__dirname + '/../migrations/*.ts'],
};

export const AppDataSource = new DataSource(dbConfig);

export const initializeAppDataSource = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  return AppDataSource;
};
