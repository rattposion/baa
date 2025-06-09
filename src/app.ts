import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorMiddleware';
import authRoutes from './routes/auth';
import equipmentRoutes from './routes/equipment';
import productionRoutes from './routes/production';
import movementRoutes from './routes/movements';
import healthRoutes from './routes/health';

config();

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Rotas
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/production', productionRoutes);
app.use('/api/movements', movementRoutes);

// Middleware de erro
app.use(errorHandler);

export default app; 