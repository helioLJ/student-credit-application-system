import { Request, Response } from 'express';
import { StudentService } from '../services/studentService';

export class StudentController {
  protected studentService: StudentService;

  constructor() {
    this.studentService = new StudentService();
  }

  async registerStudent(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;
      await this.studentService.registerStudent(name, email, password);
      res.status(201).json({ message: 'Student registered successfully' });
    } catch (error) {
      if (error instanceof Error && error.message === 'Email already in use') {
        res.status(400).json({ error: error.message });
      } else {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async loginStudent(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const token = await this.studentService.loginStudent(email, password);
      res.status(200).json({ token });
    } catch (error) {
      if (error instanceof Error && error.message === 'Invalid credentials') {
        res.status(400).json({ error: error.message });
      } else {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}

export const studentController = new StudentController();
export const registerStudent = studentController.registerStudent.bind(studentController);
export const loginStudent = studentController.loginStudent.bind(studentController);
