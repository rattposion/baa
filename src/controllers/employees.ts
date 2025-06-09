import { Request, Response } from 'express';
import Employee from '../models/Employee';

// @desc    Obter todos os funcionários
// @route   GET /api/employees
// @access  Private
export const getEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await Employee.find().sort({ name: 1 });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar funcionários' });
  }
};

// @desc    Obter um funcionário por ID
// @route   GET /api/employees/:id
// @access  Private
export const getEmployeeById = async (req: Request, res: Response) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (employee) {
      res.json(employee);
    } else {
      res.status(404).json({ message: 'Funcionário não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar funcionário' });
  }
};

// @desc    Criar um funcionário
// @route   POST /api/employees
// @access  Private/Admin
export const createEmployee = async (req: Request, res: Response) => {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar funcionário' });
  }
};

// @desc    Atualizar um funcionário
// @route   PUT /api/employees/:id
// @access  Private/Admin
export const updateEmployee = async (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar funcionário' });
  }
};

// @desc    Excluir um funcionário
// @route   DELETE /api/employees/:id
// @access  Private/Admin
export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (employee) {
      await employee.deleteOne();
      res.json({ message: 'Funcionário removido' });
    } else {
      res.status(404).json({ message: 'Funcionário não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir funcionário' });
  }
}; 