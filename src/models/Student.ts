import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CreditApplication } from './CreditApplication';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @OneToMany(() => CreditApplication, (creditApplication) => creditApplication.student)
  creditApplications: CreditApplication[];

  constructor(name: string, email: string, password: string) {
    this.name = name;
    this.email = email;
    this.password = password;
  }
}
