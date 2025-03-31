import dotenv from 'dotenv';

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/organizei',
  /*JWT_SECRET: process.env.JWT_SECRET || 'sua-chave-secreta-aqui',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',*/
}; 