import { DataSource } from "typeorm"
import { Student } from "../models/Student"
import { Admin } from "../models/Admin"
import { CreditApplication } from "../models/CreditApplication"
import bcrypt from "bcrypt"

export default class InitialSeeder {
    public async run(dataSource: DataSource): Promise<void> {
        const studentRepository = dataSource.getRepository(Student)
        const adminRepository = dataSource.getRepository(Admin)
        const creditApplicationRepository = dataSource.getRepository(CreditApplication)

        // Create students
        const students = await Promise.all([
            studentRepository.save(
                studentRepository.create({
                    name: "John Doe",
                    email: "john@example.com",
                    password: await bcrypt.hash("password123", 10)
                })
            ),
            studentRepository.save(
                studentRepository.create({
                    name: "Jane Smith",
                    email: "jane@example.com",
                    password: await bcrypt.hash("password456", 10)
                })
            )
        ])

        // Create admin
        await adminRepository.save(
            adminRepository.create({
                email: "admin@example.com",
                password: await bcrypt.hash("adminpassword", 10)
            })
        )

        // Create credit applications
        await Promise.all([
            creditApplicationRepository.save(
                creditApplicationRepository.create({
                    amount: 5000,
                    status: "pending",
                    student: students[0]
                })
            ),
            creditApplicationRepository.save(
                creditApplicationRepository.create({
                    amount: 7500,
                    status: "approved",
                    student: students[1]
                })
            ),
            creditApplicationRepository.save(
                creditApplicationRepository.create({
                    amount: 3000,
                    status: "rejected",
                    student: students[0]
                })
            )
        ])

        console.log("Initial seed completed")
    }
}