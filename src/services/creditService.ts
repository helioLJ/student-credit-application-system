import { AppDataSource } from '../config/database';
import { CreditApplication } from '../models/CreditApplication';
import { Student } from '../models/Student';
import { Repository } from 'typeorm';

export class CreditService {
  private creditApplicationRepository: Repository<CreditApplication>;
  private studentRepository: Repository<Student>;

  constructor() {
    this.creditApplicationRepository = AppDataSource.getRepository(CreditApplication);
    this.studentRepository = AppDataSource.getRepository(Student);
  }

  async applyForCredit(studentId: number, amount: number): Promise<CreditApplication> {
    const student = await this.studentRepository.findOne({ where: { id: studentId } });
    if (!student) {
      throw new Error('Student not found');
    }

    const newApplication = this.creditApplicationRepository.create({
      amount,
      status: 'pending',
      student,
    });

    return await this.creditApplicationRepository.save(newApplication);
  }

  async getAllApplications(): Promise<CreditApplication[]> {
    return await this.creditApplicationRepository.find({ relations: ['student'] });
  }

  async updateApplicationStatus(
    id: number,
    status: CreditApplication['status'],
  ): Promise<CreditApplication> {
    const application = await this.creditApplicationRepository.findOne({ where: { id } });
    if (!application) {
      throw new Error('Application not found');
    }

    application.status = status;
    return await this.creditApplicationRepository.save(application);
  }

  async getStudentApplications(studentId: number): Promise<CreditApplication[]> {
    return await this.creditApplicationRepository.find({
      where: { student: { id: studentId } },
      relations: ['student'],
    });
  }

  async getApplicationById(id: number): Promise<CreditApplication | null> {
    return await this.creditApplicationRepository.findOne({
      where: { id },
      relations: ['student'],
    });
  }
}
