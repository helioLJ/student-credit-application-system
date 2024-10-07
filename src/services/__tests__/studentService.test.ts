import { StudentService } from '../studentService';
import { AppDataSource } from '../../config/database';
import { Student } from '../../models/Student';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('../../config/database', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('StudentService', () => {
  let studentService: StudentService;
  let mockStudentRepository: jest.Mocked<Repository<Student>>;

  beforeEach(() => {
    mockStudentRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<Repository<Student>>;

    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockStudentRepository);
    studentService = new StudentService();
  });

  describe('registerStudent', () => {
    it('should register a new student successfully', async () => {
      mockStudentRepository.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      await studentService.registerStudent('John Doe', 'john@example.com', 'password123');

      expect(mockStudentRepository.create).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
      });
      expect(mockStudentRepository.save).toHaveBeenCalled();
    });

    it('should throw an error if email is already in use', async () => {
      const existingStudent = new Student('John Doe', 'john@example.com', 'hashedPassword');
      existingStudent.id = 1;
      mockStudentRepository.findOne.mockResolvedValue(existingStudent);

      await expect(
        studentService.registerStudent('John Doe', 'john@example.com', 'password123'),
      ).rejects.toThrow('Email already in use');
    });
  });

  describe('loginStudent', () => {
    it('should login a student successfully', async () => {
      const mockStudent = new Student('John Doe', 'john@example.com', 'hashedPassword');
      mockStudent.id = 1;
      mockStudentRepository.findOne.mockResolvedValue(mockStudent);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('mockToken');

      const token = await studentService.loginStudent('john@example.com', 'password123');

      expect(token).toBe('mockToken');
    });

    it('should throw an error if student is not found', async () => {
      mockStudentRepository.findOne.mockResolvedValue(null);

      await expect(studentService.loginStudent('john@example.com', 'password123')).rejects.toThrow(
        'Invalid credentials',
      );
    });

    it('should throw an error if password is invalid', async () => {
      const mockStudent = new Student('John Doe', 'john@example.com', 'hashedPassword');
      mockStudent.id = 1;
      mockStudentRepository.findOne.mockResolvedValue(mockStudent);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        studentService.loginStudent('john@example.com', 'wrongpassword'),
      ).rejects.toThrow('Invalid credentials');
    });
  });
});
