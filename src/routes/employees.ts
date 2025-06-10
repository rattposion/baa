import express from 'express';
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
} from '../controllers/employeeController';
import { authenticate } from '../middleware/authMiddleware';
import { isAdmin } from '../middleware/adminMiddleware';

const router = express.Router();

// Rotas protegidas que requerem autenticação
router.use(authenticate);

// Rotas que requerem autenticação mas não requerem admin
router.get('/', getEmployees);
router.get('/:id', getEmployeeById);

// Rotas que requerem autenticação E admin
router.use(isAdmin);
router.post('/', createEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

export default router; 