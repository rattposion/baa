import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';

import authRoutes from './routes/auth';
import employeeRoutes from './routes/employees';
import equipmentRoutes from './routes/equipment';
import productionRoutes from './routes/production';
import movementRoutes from './routes/movements';
import healthRoutes from './routes/health';

import { errorHandler } from './middlewares/error';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limite de 100 requisições por IP
});
app.use(limiter);

// Rotas
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/production', productionRoutes);
app.use('/api/movements', movementRoutes);

// Middleware de erro
app.use(errorHandler);

// Conexão com o MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mix');
    console.log(`MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    process.exit(1);
  }
};

// Iniciar servidor
const PORT = process.env.PORT || 3001;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}); 