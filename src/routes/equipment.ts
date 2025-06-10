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

// Todas as rotas requerem autenticação e permissão de admin
router.use(authenticate);
router.use(isAdmin);

// Rotas de equipamentos
router.get('/', getEquipments);
router.post('/', createEquipment);
router.get('/:id', getEquipmentById);
router.put('/:id', updateEquipment);
router.delete('/:id', deleteEquipment);

export default router; 