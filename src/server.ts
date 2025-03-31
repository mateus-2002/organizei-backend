import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import connectDB from './config/database';
import { errorHandler } from './middlewares/errorHandler';
import userRoutes from './routes/userRoutes';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
connectDB();

// Rotas
app.use('/api/v1/users', userRoutes);

// Middleware de tratamento de erros
app.use(errorHandler);

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
