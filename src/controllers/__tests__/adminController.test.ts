import { AdminController } from '../adminController';
import { AdminService } from '../../services/adminService';
import { Request, Response } from 'express';

jest.mock('../../services/adminService');

describe('Admin Controller', () => {
  let adminController: AdminController;
  let mockAdminService: jest.Mocked<AdminService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockAdminService = new AdminService() as jest.Mocked<AdminService>;
    adminController = new AdminController();
    (adminController as unknown as { adminService: AdminService }).adminService = mockAdminService;

    mockRequest = {
      body: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('loginAdmin', () => {
    it('should login admin successfully', async () => {
      mockRequest.body = { email: 'admin@example.com', password: 'password' };
      mockAdminService.loginAdmin.mockResolvedValue('mocked-token');

      await adminController.loginAdmin(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ token: 'mocked-token' });
    });

    it('should return error for invalid credentials', async () => {
      mockRequest.body = { email: 'admin@example.com', password: 'wrongpassword' };
      mockAdminService.loginAdmin.mockRejectedValue(new Error('Invalid credentials'));

      await adminController.loginAdmin(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });

    it('should handle internal server error', async () => {
      mockRequest.body = { email: 'admin@example.com', password: 'password' };
      mockAdminService.loginAdmin.mockRejectedValue(new Error('Database error'));

      await adminController.loginAdmin(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });
});
