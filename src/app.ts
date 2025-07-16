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
import employeeRoutes from './routes/employeeRoutes';
import separacaoMacsRoutes from './routes/separacaoMacs';

config();

const app = express();

// Middlewares
app.use(cors({
  origin: ['https://decore-alpha.vercel.app', 'null', 'file://', 'http://localhost:5173', 'http://localhost:8000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(morgan('dev'));

// Rotas
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/production', productionRoutes);
app.use('/api/movements', movementRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/separacao-macs', separacaoMacsRoutes);

// Middleware de erro
app.use(errorHandler);

export default app; 