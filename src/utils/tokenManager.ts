import jwt from 'jsonwebtoken';
import { AppError } from '../middlewares/errorHandler';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const generateToken = (userId: string, expiresIn: jwt.SignOptions["expiresIn"] = '24h'): string => {
  try {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn });
  } catch (error) {
    throw new AppError('Erro ao gerar token', 500);
  }
};

export const verifyToken = (token: string): { id: string } => {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string };
  } catch (error) {
    throw new AppError('Token inválido ou expirado', 401);
  }
};