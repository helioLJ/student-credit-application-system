import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../auth';
import { AuthenticatedRequest, JwtPayload } from '../../types';

jest.mock('jsonwebtoken');

describe('Authentication Middleware', () => {
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      sendStatus: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  it('should return 401 if no token is provided', () => {
    authenticateToken(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);

    expect(mockResponse.sendStatus).toHaveBeenCalledWith(401);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should return 403 if token is invalid', () => {
    mockRequest.headers = { authorization: 'Bearer invalid_token' };
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    authenticateToken(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);

    expect(mockResponse.sendStatus).toHaveBeenCalledWith(403);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should call next() if token is valid', () => {
    mockRequest.headers = { authorization: 'Bearer valid_token' };
    const mockUser: JwtPayload = { id: 1, username: 'testuser' };
    (jwt.verify as jest.Mock).mockReturnValue(mockUser);

    authenticateToken(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);

    expect(mockRequest.user).toEqual(mockUser);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.sendStatus).not.toHaveBeenCalled();
  });

  it('should handle "Bearer " prefix in Authorization header', () => {
    mockRequest.headers = { authorization: 'Bearer valid_token' };
    const mockUser: JwtPayload = { id: 1, username: 'testuser' };
    (jwt.verify as jest.Mock).mockReturnValue(mockUser);

    authenticateToken(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);

    expect(mockRequest.user).toEqual(mockUser);
    expect(nextFunction).toHaveBeenCalled();
  });
});
