import { Request } from 'express';

export interface JwtPayload {
  id: number;
  role?: string;
  [key: string]: unknown;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}