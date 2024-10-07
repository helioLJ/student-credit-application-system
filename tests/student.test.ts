import request from 'supertest';
import { AppDataSource, initializeDataSource } from '../src/config/database';
import app from '../src/app';

describe('Student API', () => {
  beforeAll(async () => {
    await initializeDataSource();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  describe('POST /api/students/register', () => {
    it('should register a new student', async () => {
      const uniqueEmail = `test${Date.now()}@example.com`;
      const response = await request(app)
        .post('/api/students/register')
        .send({
          name: 'Test Student',
          email: uniqueEmail,
          password: 'password123',
        });

      if (response.status !== 201) {
        console.error('Registration failed:', response.body);
      }

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Student registered successfully');
    });
  });

  describe('POST /api/students/login', () => {
    it('should login a registered student', async () => {
      // First, register a student
      const uniqueEmail = `logintest${Date.now()}@example.com`;
      await request(app)
        .post('/api/students/register')
        .send({
          name: 'Login Test Student',
          email: uniqueEmail,
          password: 'password123',
        });

      // Then, try to login
      const response = await request(app)
        .post('/api/students/login')
        .send({
          email: uniqueEmail,
          password: 'password123',
        });

      if (response.status !== 200) {
        console.error('Login failed:', response.body);
      }

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });
  });
});