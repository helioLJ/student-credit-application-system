import { DataSource, DataSourceOptions } from "typeorm";
import { SeederOptions } from "typeorm-extension";
import { Student } from '../models/Student';
import { CreditApplication } from '../models/CreditApplication';
import { Admin } from '../models/Admin';
import InitialSeeder from '../seeds/initialSeed';

const isTestEnvironment = process.env.NODE_ENV === 'test';

const options: DataSourceOptions & SeederOptions = {
  type: isTestEnvironment ? 'sqlite' : 'postgres',
  database: isTestEnvironment ? ':memory:' : (process.env.DB_NAME || 'myapp_db'),
  host: isTestEnvironment ? undefined : (process.env.DB_HOST || 'localhost'),
  port: isTestEnvironment ? undefined : parseInt(process.env.DB_PORT || '5432'),
  username: isTestEnvironment ? undefined : (process.env.DB_USERNAME || 'myapp_user'),
  password: isTestEnvironment ? undefined : (process.env.DB_PASSWORD || 'myapp_password'),
  entities: [Student, CreditApplication, Admin],
  synchronize: true,
  seeds: [InitialSeeder],
  dropSchema: isTestEnvironment,
};

export const AppDataSource = new DataSource(options);

export const initializeDataSource = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    if (!isTestEnvironment) {
      process.exit(1);
    }
  }
};
