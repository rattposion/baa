import express from 'express';
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '../controllers/employees';
import { protect, admin } from '../middlewares/auth';

const router = express.Router();

// Rotas que requerem apenas autenticação
router.route('/')
  .get(protect, getEmployees);

router.route('/:id')
  .get(protect, getEmployeeById);

// Rotas que requerem permissão de admin
router.post('/', protect, admin, createEmployee);
router.put('/:id', protect, admin, updateEmployee);
router.delete('/:id', protect, admin, deleteEmployee);

export default router; 