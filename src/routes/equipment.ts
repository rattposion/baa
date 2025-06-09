import express from 'express';
import {
  getEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
} from '../controllers/equipment';
import { protect, admin } from '../middlewares/auth';

const router = express.Router();

router.route('/')
  .get(protect, getEquipment)
  .post(protect, admin, createEquipment);

router.route('/:id')
  .get(protect, getEquipmentById)
  .put(protect, admin, updateEquipment)
  .delete(protect, admin, deleteEquipment);

export default router; 