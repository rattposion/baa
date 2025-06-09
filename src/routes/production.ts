import express from 'express';
import {
  getProduction,
  getProductionById,
  createProduction,
  updateProduction,
  deleteProduction,
} from '../controllers/production';
import { protect, admin } from '../middlewares/auth';

const router = express.Router();

router.route('/')
  .get(protect, getProduction)
  .post(protect, createProduction);

router.route('/:id')
  .get(protect, getProductionById)
  .put(protect, admin, updateProduction)
  .delete(protect, admin, deleteProduction);

export default router; 