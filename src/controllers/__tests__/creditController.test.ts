import { CreditController } from '../creditController';
import { CreditService } from '../../services/creditService';
import { AuthenticatedRequest } from '../../types';
import { Response } from 'express';
import { CreditApplication } from '../../models/CreditApplication';

// Mock the CreditService
jest.mock('../../services/creditService');

describe('CreditController', () => {
  let creditController: CreditController;
  let mockCreditService: jest.Mocked<CreditService>;
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    // Create a mock of CreditService
    mockCreditService = {
      applyForCredit: jest.fn(),
      getAllApplications: jest.fn(),
      updateApplicationStatus: jest.fn(),
      getStudentApplications: jest.fn(),
      getApplicationById: jest.fn(),
    } as unknown as jest.Mocked<CreditService>;

    // Create a new instance of CreditController
    creditController = new CreditController();
    // Inject the mock service
    (creditController as any).creditService = mockCreditService;

    mockRequest = {
      body: {},
      user: { id: 1 },
      params: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('applyCreditApplication', () => {
    it('should create a new credit application successfully', async () => {
      mockRequest.body = { amount: 1000 };
      const mockApplication = { id: 1, amount: 1000, status: 'pending' } as CreditApplication;
      mockCreditService.applyForCredit.mockResolvedValue(mockApplication);

      await creditController.applyCreditApplication(mockRequest as AuthenticatedRequest, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Credit application submitted successfully',
        application: mockApplication,
      });
    });

    it('should return an error if student is not found', async () => {
      mockRequest.body = { amount: 1000 };
      mockCreditService.applyForCredit.mockRejectedValue(new Error('Student not found'));

      await creditController.applyCreditApplication(mockRequest as AuthenticatedRequest, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Student not found' });
    });
  });

  describe('getCreditApplications', () => {
    it('should return all credit applications', async () => {
      const mockApplications = [
        { id: 1, amount: 1000, status: 'pending' },
        { id: 2, amount: 2000, status: 'approved' },
      ] as CreditApplication[];
      mockCreditService.getAllApplications.mockResolvedValue(mockApplications);

      await creditController.getCreditApplications(mockRequest as AuthenticatedRequest, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockApplications);
    });
  });

  describe('updateCreditApplication', () => {
    it('should update a credit application successfully', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { status: 'approved' };
      const mockUpdatedApplication = { id: 1, amount: 1000, status: 'approved' } as CreditApplication;
      mockCreditService.updateApplicationStatus.mockResolvedValue(mockUpdatedApplication);

      await creditController.updateCreditApplication(mockRequest as AuthenticatedRequest, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Credit application updated successfully',
        application: mockUpdatedApplication,
      });
    });

    it('should return an error if application is not found', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { status: 'approved' };
      mockCreditService.updateApplicationStatus.mockRejectedValue(new Error('Application not found'));

      await creditController.updateCreditApplication(mockRequest as AuthenticatedRequest, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Application not found' });
    });
  });

  describe('getStudentCreditApplications', () => {
    it('should return credit applications for the authenticated student', async () => {
      const mockApplications = [
        { id: 1, amount: 1000, status: 'pending' },
        { id: 2, amount: 2000, status: 'approved' },
      ] as CreditApplication[];
      mockCreditService.getStudentApplications.mockResolvedValue(mockApplications);

      await creditController.getStudentCreditApplications(mockRequest as AuthenticatedRequest, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockApplications);
    });

    it('should return an error if user is not authenticated', async () => {
      mockRequest.user = undefined;

      await creditController.getStudentCreditApplications(mockRequest as AuthenticatedRequest, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });
  });
});