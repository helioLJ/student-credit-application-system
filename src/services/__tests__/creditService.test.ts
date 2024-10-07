import { CreditService } from '../creditService';
import { AppDataSource } from '../../config/database';
import { CreditApplication } from '../../models/CreditApplication';
import { Student } from '../../models/Student';
import { Repository } from 'typeorm';

jest.mock('../../config/database', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

describe('CreditService', () => {
  let creditService: CreditService;
  let mockCreditApplicationRepository: jest.Mocked<Repository<CreditApplication>>;
  let mockStudentRepository: jest.Mocked<Repository<Student>>;

  beforeEach(() => {
    mockCreditApplicationRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
    } as any;

    mockStudentRepository = {
      findOne: jest.fn(),
    } as any;

    (AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
      if (entity === CreditApplication) return mockCreditApplicationRepository;
      if (entity === Student) return mockStudentRepository;
      return {} as any;
    });

    creditService = new CreditService();
  });

  describe('applyForCredit', () => {
    it('should create a new credit application', async () => {
      const studentId = 1;
      const amount = 1000;
      const mockStudent = { id: studentId };
      const mockApplication = { id: 1, amount, status: 'pending', student: mockStudent };

      mockStudentRepository.findOne.mockResolvedValue(mockStudent as Student);
      mockCreditApplicationRepository.create.mockReturnValue(mockApplication as CreditApplication);
      mockCreditApplicationRepository.save.mockResolvedValue(mockApplication as CreditApplication);

      const result = await creditService.applyForCredit(studentId, amount);

      expect(result).toEqual(mockApplication);
      expect(mockStudentRepository.findOne).toHaveBeenCalledWith({ where: { id: studentId } });
      expect(mockCreditApplicationRepository.create).toHaveBeenCalledWith({
        amount,
        status: 'pending',
        student: mockStudent,
      });
      expect(mockCreditApplicationRepository.save).toHaveBeenCalledWith(mockApplication);
    });

    it('should throw an error if student is not found', async () => {
      mockStudentRepository.findOne.mockResolvedValue(null);

      await expect(creditService.applyForCredit(1, 1000)).rejects.toThrow('Student not found');
    });
  });

  describe('getAllApplications', () => {
    it('should return all credit applications', async () => {
      const mockApplications = [
        { id: 1, amount: 1000, status: 'pending' },
        { id: 2, amount: 2000, status: 'approved' },
      ];
      mockCreditApplicationRepository.find.mockResolvedValue(mockApplications as CreditApplication[]);

      const result = await creditService.getAllApplications();

      expect(result).toEqual(mockApplications);
      expect(mockCreditApplicationRepository.find).toHaveBeenCalledWith({ relations: ['student'] });
    });
  });

  describe('updateApplicationStatus', () => {
    it('should update the status of a credit application', async () => {
      const applicationId = 1;
      const newStatus = 'approved' as const;
      const mockApplication = { id: applicationId, amount: 1000, status: 'pending' };
      const updatedApplication = { ...mockApplication, status: newStatus };

      mockCreditApplicationRepository.findOne.mockResolvedValue(mockApplication as CreditApplication);
      mockCreditApplicationRepository.save.mockResolvedValue(updatedApplication as CreditApplication);

      const result = await creditService.updateApplicationStatus(applicationId, newStatus);

      expect(result).toEqual(updatedApplication);
      expect(mockCreditApplicationRepository.findOne).toHaveBeenCalledWith({ where: { id: applicationId } });
      expect(mockCreditApplicationRepository.save).toHaveBeenCalledWith(updatedApplication);
    });

    it('should throw an error if application is not found', async () => {
      mockCreditApplicationRepository.findOne.mockResolvedValue(null);

      await expect(creditService.updateApplicationStatus(1, 'approved')).rejects.toThrow('Application not found');
    });
  });

  describe('getStudentApplications', () => {
    it('should return credit applications for a specific student', async () => {
      const studentId = 1;
      const mockApplications = [
        { id: 1, amount: 1000, status: 'pending' },
        { id: 2, amount: 2000, status: 'approved' },
      ];
      mockCreditApplicationRepository.find.mockResolvedValue(mockApplications as CreditApplication[]);

      const result = await creditService.getStudentApplications(studentId);

      expect(result).toEqual(mockApplications);
      expect(mockCreditApplicationRepository.find).toHaveBeenCalledWith({
        where: { student: { id: studentId } },
        relations: ['student'],
      });
    });
  });

  describe('getApplicationById', () => {
    it('should return a credit application by id', async () => {
      const applicationId = 1;
      const mockApplication = { id: applicationId, amount: 1000, status: 'pending' };
      mockCreditApplicationRepository.findOne.mockResolvedValue(mockApplication as CreditApplication);

      const result = await creditService.getApplicationById(applicationId);

      expect(result).toEqual(mockApplication);
      expect(mockCreditApplicationRepository.findOne).toHaveBeenCalledWith({
        where: { id: applicationId },
        relations: ['student'],
      });
    });

    it('should return null if application is not found', async () => {
      mockCreditApplicationRepository.findOne.mockResolvedValue(null);

      const result = await creditService.getApplicationById(1);

      expect(result).toBeNull();
    });
  });
});