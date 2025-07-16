import { Router } from 'express';
import {
  getProduction,
  getProductionById,
  createProduction,
  updateProduction,
  deleteProduction,
} from '../controllers/production';
import { protect } from '../middlewares/auth';

const router = Router();

router.route('/')
  .get(protect, getProduction)
  .post(protect, createProduction);

router.route('/:id')
  .get(protect, getProductionById)
  .put(protect, updateProduction)
  .delete(protect, deleteProduction);

export default router; 