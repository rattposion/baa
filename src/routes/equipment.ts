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

// Rotas que requerem apenas autenticação
router.route('/')
  .get(protect, getEquipment);

router.route('/:id')
  .get(protect, getEquipmentById);

// Rotas que requerem permissão de admin
router.post('/', protect, admin, createEquipment);
router.put('/:id', protect, admin, updateEquipment);
router.delete('/:id', protect, admin, deleteEquipment);

export default router; 