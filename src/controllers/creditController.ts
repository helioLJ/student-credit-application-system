import { Response } from 'express';
import { CreditService } from '../services/creditService';
import { AuthenticatedRequest } from '../types';

export class CreditController {
  private creditService: CreditService;

  constructor() {
    this.creditService = new CreditService();
  }

  async applyCreditApplication(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { amount } = req.body;
      const studentId = req.user?.id;
      if (!studentId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const application = await this.creditService.applyForCredit(studentId, amount);
      res.status(201).json({ message: 'Credit application submitted successfully', application });
    } catch (error) {
      if (error instanceof Error && error.message === 'Student not found') {
        res.status(404).json({ error: error.message });
      } else {
        console.error('Error in applyCreditApplication:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getCreditApplications(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const applications = await this.creditService.getAllApplications();
      res.status(200).json(applications);
    } catch (error) {
      console.error('Error in getCreditApplications:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateCreditApplication(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const application = await this.creditService.updateApplicationStatus(Number(id), status);
      res.status(200).json({ message: 'Credit application updated successfully', application });
    } catch (error) {
      if (error instanceof Error && error.message === 'Application not found') {
        res.status(404).json({ error: error.message });
      } else {
        console.error('Error in updateCreditApplication:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getStudentCreditApplications(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const studentId = req.user?.id;
      if (!studentId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const applications = await this.creditService.getStudentApplications(studentId);
      res.status(200).json(applications);
    } catch (error) {
      console.error('Error in getStudentCreditApplications:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}