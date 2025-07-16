import { Router } from 'express';
import {
  getProduction,
  getProductionById,
  createProduction,
  updateProduction,
  deleteProduction,
} from '../controllers/production';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.route('/')
  .get(authenticateToken, getProduction)
  .post(authenticateToken, createProduction);

router.route('/:id')
  .get(authenticateToken, getProductionById)
  .put(authenticateToken, updateProduction)
  .delete(authenticateToken, deleteProduction);

export default router; 