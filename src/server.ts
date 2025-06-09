import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import connectDB from './config/database';

import authRoutes from './routes/auth';
import employeeRoutes from './routes/employees';
import equipmentRoutes from './routes/equipment';
import productionRoutes from './routes/production';
import movementRoutes from './routes/movements';

import { errorHandler } from './middlewares/error';

dotenv.config();

const app = express();

// Conectar ao banco de dados
connectDB();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limite de 100 requisições por windowMs
});
app.use(limiter);

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/production', productionRoutes);
app.use('/api/movements', movementRoutes);

// Middleware de erro
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 