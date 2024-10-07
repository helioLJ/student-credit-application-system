import { AppDataSource } from '../config/database';
import { Admin } from '../models/Admin';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AdminService {
  private adminRepository = AppDataSource.getRepository(Admin);

  async loginAdmin(email: string, password: string): Promise<string> {
    const admin = await this.adminRepository.findOne({ where: { email } });
    if (!admin) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ id: admin.id, role: 'admin' }, process.env.JWT_SECRET as string, {
      expiresIn: '1h',
    });
    return token;
  }
}
