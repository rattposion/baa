import express from 'express';
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeById
} from '../controllers/employeeController';

const router = express.Router();

// Rotas de funcionários
router.get('/', getEmployees);
router.post('/', createEmployee);
router.get('/:id', getEmployeeById);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

export default router; 