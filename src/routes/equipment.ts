import express from 'express';
import {
  getEquipments,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  getEquipmentById
} from '../controllers/equipmentController';
import { authenticate } from '../middleware/authMiddleware';
import { isAdmin } from '../middleware/adminMiddleware';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticate);

// Rotas públicas (requerem apenas autenticação)
router.get('/', getEquipments);
router.get('/:id', getEquipmentById);

// Rotas que requerem permissão de admin
router.post('/', isAdmin, createEquipment);
router.put('/:id', isAdmin, updateEquipment);
router.delete('/:id', isAdmin, deleteEquipment);

export default router; 