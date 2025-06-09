import express from 'express';
import {
  getMovements,
  getMovementById,
  createMovement,
  updateMovement,
  deleteMovement,
} from '../controllers/movements';
import { protect, admin } from '../middlewares/auth';

const router = express.Router();

router.route('/')
  .get(protect, getMovements)
  .post(protect, createMovement);

router.route('/:id')
  .get(protect, getMovementById)
  .put(protect, admin, updateMovement)
  .delete(protect, admin, deleteMovement);

export default router; 