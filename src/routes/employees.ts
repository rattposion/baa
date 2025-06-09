import express from 'express';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { protect, admin } from '../middlewares/auth';
import Employee from '../models/Employee';

const router = express.Router();

// @desc    Obter todos os funcionários
// @route   GET /api/employees
// @access  Private
router.get('/', protect, asyncHandler(async (_req: Request, res: Response) => {
  const employees = await Employee.find();
  res.json(employees);
}));

// @desc    Obter um funcionário por ID
// @route   GET /api/employees/:id
// @access  Private
router.get('/:id', protect, asyncHandler(async (req: Request, res: Response) => {
  const employee = await Employee.findById(req.params.id);

  if (employee) {
    res.json(employee);
  } else {
    res.status(404).json({ message: 'Funcionário não encontrado' });
  }
}));

// @desc    Criar um funcionário
// @route   POST /api/employees
// @access  Private/Admin
router.post('/', protect, admin, asyncHandler(async (req: Request, res: Response) => {
  const employee = await Employee.create(req.body);
  res.status(201).json(employee);
}));

// @desc    Atualizar um funcionário
// @route   PUT /api/employees/:id
// @access  Private/Admin
router.put('/:id', protect, admin, asyncHandler(async (req: Request, res: Response) => {
  const employee = await Employee.findById(req.params.id);

  if (employee) {
    employee.name = req.body.name || employee.name;
    employee.department = req.body.department || employee.department;
    employee.active = req.body.active !== undefined ? req.body.active : employee.active;

    const updatedEmployee = await employee.save();
    res.json(updatedEmployee);
  } else {
    res.status(404).json({ message: 'Funcionário não encontrado' });
  }
}));

// @desc    Excluir um funcionário
// @route   DELETE /api/employees/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, asyncHandler(async (req: Request, res: Response) => {
  const employee = await Employee.findById(req.params.id);

  if (employee) {
    await employee.deleteOne();
    res.json({ message: 'Funcionário removido' });
  } else {
    res.status(404).json({ message: 'Funcionário não encontrado' });
  }
}));

export default router; 