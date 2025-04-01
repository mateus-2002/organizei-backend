import jwt from 'jsonwebtoken';
import { AppError } from '../middlewares/errorHandler';

const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta-aqui';

export const generateToken = (userId: string): string => {
  try {
    return jwt.sign({ id: userId }, JWT_SECRET, {
      expiresIn: '24h'
    });
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