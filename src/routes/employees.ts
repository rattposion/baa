import express from 'express';
import { protect, admin } from '../middlewares/auth';
import Employee from '../models/Employee';

const router = express.Router();

// @desc    Obter todos os funcionários
// @route   GET /api/employees
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar funcionários' });
  }
});

// @desc    Criar um novo funcionário
// @route   POST /api/employees
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, department, active } = req.body;

    const employee = new Employee({
      name,
      department,
      active: active !== undefined ? active : true
    });

    const savedEmployee = await employee.save();
    res.status(201).json(savedEmployee);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar funcionário' });
  }
});

// @desc    Atualizar um funcionário
// @route   PUT /api/employees/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { name, department, active } = req.body;
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Funcionário não encontrado' });
    }

    employee.name = name || employee.name;
    employee.department = department || employee.department;
    employee.active = active !== undefined ? active : employee.active;

    const updatedEmployee = await employee.save();
    res.json(updatedEmployee);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar funcionário' });
  }
});

// @desc    Excluir um funcionário
// @route   DELETE /api/employees/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Funcionário não encontrado' });
    }

    await employee.deleteOne();
    res.json({ message: 'Funcionário removido' });
  } catch (error) {
    res.status(400).json({ message: 'Erro ao excluir funcionário' });
  }
});

// @desc    Obter um funcionário específico
// @route   GET /api/employees/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Funcionário não encontrado' });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar funcionário' });
  }
});

export default router; 