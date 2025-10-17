import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';

export interface AuthRequest extends Request {
  userId?: string;
}

export class AuthMiddleware {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        res.status(401).json({
          error: 'JWT_MANQUANT_OU_INVALIDE',
          message: 'Token d\'accès requis'
        });
        return;
      }

      const decoded = this.userService.verifyToken(token);
      req.userId = decoded.userId;
      next();
    } catch (error: any) {
      res.status(401).json({
        error: 'JWT_MANQUANT_OU_INVALIDE',
        message: 'Token invalide'
      });
    }
  };
}