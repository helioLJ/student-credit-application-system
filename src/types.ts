import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    // Add other properties if needed
  };
}