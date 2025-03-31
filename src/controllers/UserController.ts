import { Request, Response } from 'express';
import { User } from '../models/User';
import { hash } from '../utils/hashManager';
import { AppError } from '../middlewares/errorHandler';

export class UserController {
  async getUsers(req: Request, res: Response) {
    try {
      const users = await User.find().select('-password');
      
      return res.status(200).json({
        status: 'success',
        data: users
      });
    } catch (error) {
      throw new AppError('Erro ao buscar usuários', 500);
    }
  }
} 