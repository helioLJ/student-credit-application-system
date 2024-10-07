import { AppDataSource } from '../config/database';
import InitialSeeder from './initialSeed';

async function runSeed() {
  try {
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');

    const seeder = new InitialSeeder();
    await seeder.run(AppDataSource);

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

runSeed().catch(error => console.log(error));