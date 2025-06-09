import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    // Verifica a conexão com o MongoDB
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

    // Informações sobre o ambiente
    const environment = process.env.NODE_ENV || 'development';
    const uptime = process.uptime();

    // Informações sobre memória
    const memoryUsage = process.memoryUsage();

    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment,
      database: {
        status: dbStatus,
        name: mongoose.connection.name
      },
      server: {
        uptime: `${Math.floor(uptime / 60)} minutes`,
        memory: {
          heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
          rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error checking health status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 