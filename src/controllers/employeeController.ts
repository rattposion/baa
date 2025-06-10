import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Employee from '../models/Employee';

// @desc    Obter todos os funcionários
// @route   GET /api/employees
// @access  Private
export const getEmployees = asyncHandler(async (_req: Request, res: Response) => {
  const employees = await Employee.find().select('-password');
  res.json(employees);
});

// @desc    Obter funcionário por ID
// @route   GET /api/employees/:id
// @access  Private
export const getEmployeeById = asyncHandler(async (req: Request, res: Response) => {
  const employee = await Employee.findById(req.params.id).select('-password');
  
  if (employee) {
    res.json(employee);
  } else {
    res.status(404);
    throw new Error('Funcionário não encontrado');
  }
});

// @desc    Criar funcionário
// @route   POST /api/employees
// @access  Private/Admin
export const createEmployee = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  // Validar campos obrigatórios
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Por favor, preencha todos os campos obrigatórios');
  }

  // Verificar se o email já está em uso
  const employeeExists = await Employee.findOne({ email });
  if (employeeExists) {
    res.status(400);
    throw new Error('Este email já está em uso');
  }

  // Criar o funcionário
  const employee = await Employee.create({
    name,
    email,
    password,
    role: role || 'user',
    active: true
  });

  if (employee) {
    res.status(201).json({
      id: employee._id,
      name: employee.name,
      email: employee.email,
      role: employee.role,
      active: employee.active
    });
  } else {
    res.status(400);
    throw new Error('Dados de funcionário inválidos');
  }
});

// @desc    Atualizar funcionário
// @route   PUT /api/employees/:id
// @access  Private/Admin
export const updateEmployee = asyncHandler(async (req: Request, res: Response) => {
  const employee = await Employee.findById(req.params.id);

  if (employee) {
    // Se estiver atualizando o email, verificar se já está em uso
    if (req.body.email && req.body.email !== employee.email) {
      const emailExists = await Employee.findOne({ email: req.body.email });
      if (emailExists) {
        res.status(400);
        throw new Error('Este email já está em uso');
      }
    }

    employee.name = req.body.name || employee.name;
    employee.email = req.body.email || employee.email;
    if (req.body.password) {
      employee.password = req.body.password;
    }
    employee.role = req.body.role || employee.role;
    employee.active = req.body.active !== undefined ? req.body.active : employee.active;

    const updatedEmployee = await employee.save();

    res.json({
      id: updatedEmployee._id,
      name: updatedEmployee.name,
      email: updatedEmployee.email,
      role: updatedEmployee.role,
      active: updatedEmployee.active
    });
  } else {
    res.status(404);
    throw new Error('Funcionário não encontrado');
  }
});

// @desc    Excluir funcionário
// @route   DELETE /api/employees/:id
// @access  Private/Admin
export const deleteEmployee = asyncHandler(async (req: Request, res: Response) => {
  const employee = await Employee.findById(req.params.id);

  if (employee) {
    await employee.deleteOne();
    res.json({ message: 'Funcionário removido' });
  } else {
    res.status(404);
    throw new Error('Funcionário não encontrado');
  }
});