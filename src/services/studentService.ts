import { AppDataSource } from '../config/database';
import { Student } from '../models/Student';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class StudentService {
  private studentRepository = AppDataSource.getRepository(Student);

  async registerStudent(name: string, email: string, password: string): Promise<void> {
    const existingStudent = await this.studentRepository.findOne({ where: { email } });
    if (existingStudent) {
      throw new Error('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newStudent = this.studentRepository.create({ name, email, password: hashedPassword });
    await this.studentRepository.save(newStudent);
  }

  async loginStudent(email: string, password: string): Promise<string> {
    const student = await this.studentRepository.findOne({ where: { email } });
    if (!student) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, student.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ id: student.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    return token;
  }
}