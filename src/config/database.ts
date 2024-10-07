import { DataSource } from 'typeorm';
import { Student } from '../models/Student';
import { CreditApplication } from '../models/CreditApplication';
import { Admin } from '../models/Admin';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'myapp_user',
  password: process.env.DB_PASSWORD || 'myapp_password',
  database: process.env.DB_NAME || 'myapp_db',
  entities: [Student, CreditApplication, Admin],
  synchronize: true,
});

export const initializeDataSource = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};