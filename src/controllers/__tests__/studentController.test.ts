import { StudentController } from '../studentController';
import { StudentService } from '../../services/studentService';
import { Request, Response } from 'express';

jest.mock('../../services/studentService');

describe('StudentController', () => {
  let studentController: StudentController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockStudentService: jest.Mocked<StudentService>;

  beforeEach(() => {
    mockRequest = {
      body: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockStudentService = {
      registerStudent: jest.fn(),
      loginStudent: jest.fn(),
    } as unknown as jest.Mocked<StudentService>;
    (StudentService as jest.Mock).mockImplementation(() => mockStudentService);

    studentController = new StudentController();
    (studentController as any).studentService = mockStudentService;
  });

  describe('registerStudent', () => {
    it('should register a new student successfully', async () => {
      mockRequest.body = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };
      mockStudentService.registerStudent.mockResolvedValue(undefined);

      await studentController.registerStudent(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Student registered successfully' });
    });

    it('should return an error if email is already in use', async () => {
      mockRequest.body = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };
      mockStudentService.registerStudent.mockRejectedValue(new Error('Email already in use'));

      await studentController.registerStudent(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Email already in use' });
    });
  });

  describe('loginStudent', () => {
    it('should login a student successfully', async () => {
      mockRequest.body = {
        email: 'john@example.com',
        password: 'password123',
      };
      mockStudentService.loginStudent.mockResolvedValue('mockToken');

      await studentController.loginStudent(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ token: 'mockToken' });
    });

    it('should return an error for invalid credentials', async () => {
      mockRequest.body = {
        email: 'john@example.com',
        password: 'wrongpassword',
      };
      mockStudentService.loginStudent.mockRejectedValue(new Error('Invalid credentials'));

      await studentController.loginStudent(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });
  });
});