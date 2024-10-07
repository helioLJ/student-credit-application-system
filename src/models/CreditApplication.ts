import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Student } from './Student';

@Entity()
export class CreditApplication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column()
  status: 'pending' | 'approved' | 'rejected';

  @ManyToOne(() => Student, student => student.creditApplications)
  student: Student;
}