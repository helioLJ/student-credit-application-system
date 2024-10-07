import request from 'supertest';
import { CreditApplication } from '../src/models/CreditApplication';
import app from '../src/app';
import { AppDataSource } from '../src/config/database';
import { Admin } from '../src/models/Admin';
import bcrypt from 'bcrypt';
import { setupTestDatabase, teardownTestDatabase } from '../src/test-utils/setup-test-db';

describe('Credit Application Integration Tests', () => {
  let authToken: string;
  let adminToken: string;

  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    // Create an admin user
    const adminRepository = AppDataSource.getRepository(Admin);
    const hashedPassword = await bcrypt.hash('adminpass', 10);
    const admin = adminRepository.create({
      email: 'admin@example.com',
      password: hashedPassword
    });
    await adminRepository.save(admin);

    // Register and login a test student
    const registerResponse = await request(app)
      .post('/api/students/register')
      .send({ name: 'Test Student', email: 'test@example.com', password: 'password123' });
    
    console.log('Student registration response:', registerResponse.status, registerResponse.body);

    const loginResponse = await request(app)
      .post('/api/students/login')
      .send({ email: 'test@example.com', password: 'password123' });

    console.log('Student login response:', loginResponse.status, loginResponse.body);

    authToken = loginResponse.body.token;

    // Admin login
    const adminLoginResponse = await request(app)
      .post('/api/admin/login')
      .send({ email: 'admin@example.com', password: 'adminpass' });

    console.log('Admin login response:', adminLoginResponse.status, adminLoginResponse.body);

    expect(adminLoginResponse.status).toBe(200);
    expect(adminLoginResponse.body).toHaveProperty('token');
    adminToken = adminLoginResponse.body.token;
  });

  describe('Credit Application Process', () => {
    it('should allow a student to apply for credit', async () => {
      const response = await request(app)
        .post('/api/credits/apply')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ amount: 5000 });

      if (response.status !== 201) {
        console.error('Apply for credit failed:', response.body);
      }

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Credit application submitted successfully');
    });

    it('should retrieve all credit applications for an admin', async () => {
      // First, create a credit application
      await request(app)
        .post('/api/credits/apply')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ amount: 5000 });

      const response = await request(app)
        .get('/api/credits')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should allow updating the status of a credit application', async () => {
      // First, create a credit application
      await request(app)
        .post('/api/credits/apply')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ amount: 5000 });

      // Then, get all applications
      const getResponse = await request(app)
        .get('/api/credits/my-applications')
        .set('Authorization', `Bearer ${authToken}`);

      expect(getResponse.status).toBe(200);
      expect(getResponse.body.length).toBeGreaterThan(0);

      const applicationId = getResponse.body[0].id;

      const updateResponse = await request(app)
        .put(`/api/credits/${applicationId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'approved' });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body).toHaveProperty('message', 'Credit application updated successfully');
    });
  });

  describe('Student-Credit Application Relationship', () => {
    it('should allow a student to view their own credit applications', async () => {
      // First, create a credit application
      await request(app)
        .post('/api/credits/apply')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ amount: 5000 });

      const response = await request(app)
        .get('/api/credits/my-applications')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      response.body.forEach((application: CreditApplication) => {
        expect(application).toHaveProperty('student');
        expect(application.student.email).toBe('test@example.com');
      });
    });
  });
});
