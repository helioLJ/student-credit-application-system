import { Request, Response } from 'express';
import { AdminService } from '../services/adminService';

export class AdminController {
  private adminService: AdminService;

  constructor() {
    this.adminService = new AdminService();
  }

  async loginAdmin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const token = await this.adminService.loginAdmin(email, password);
      res.status(200).json({ token });
    } catch (error) {
      if (error instanceof Error && error.message === 'Invalid credentials') {
        res.status(400).json({ error: error.message });
      } else {
        console.error('Admin login error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}

// Export an instance of the method for use in routes
export const adminController = new AdminController();
export const loginAdmin = adminController.loginAdmin.bind(adminController);