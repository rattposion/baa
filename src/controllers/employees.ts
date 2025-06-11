import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Employee from '../models/Employee';
import User from '../models/User';
import bcrypt from 'bcryptjs';

// @desc    Obter todos os funcionários
// @route   GET /api/employees
// @access  Private
export const getEmployees = asyncHandler(async (_req: Request, res: Response) => {
  const employees = await Employee.find().select('-password');
  res.json(employees);
});

// @desc    Obter um funcionário por ID
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

// @desc    Criar um funcionário
// @route   POST /api/employees
// @access  Private/Admin
export const createEmployee = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  console.log('Dados recebidos para criar funcionário:', { name, email, role });

  // Validar campos obrigatórios
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Por favor, preencha todos os campos obrigatórios');
  }

  // Verificar se o email já está em uso em ambas as coleções
  const employeeExists = await Employee.findOne({ email });
  const userExists = await User.findOne({ email });
  
  console.log('Verificação de email existente:', { employeeExists: !!employeeExists, userExists: !!userExists });
  
  if (employeeExists || userExists) {
    res.status(400);
    throw new Error('Este email já está em uso');
  }

  try {
    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log('Senha hasheada com sucesso');

    // Criar o funcionário
    const employee = await Employee.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
      active: true
    });

    console.log('Funcionário criado:', { id: employee._id, name: employee.name, email: employee.email });

    // Criar o usuário correspondente
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
      active: true
    });

    console.log('Usuário criado:', { id: user._id, name: user.name, email: user.email });

    if (employee && user) {
      // Verificar se os registros foram realmente salvos
      const savedEmployee = await Employee.findById(employee._id);
      const savedUser = await User.findById(user._id);

      console.log('Verificação pós-criação:', {
        employeeSaved: !!savedEmployee,
        userSaved: !!savedUser
      });

      if (!savedEmployee || !savedUser) {
        throw new Error('Erro ao verificar registros salvos');
      }

      res.status(201).json({
        id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        active: employee.active
      });
    } else {
      // Se algo der errado, tentar remover o que foi criado
      if (employee) {
        console.log('Removendo funcionário após erro:', employee._id);
        await employee.deleteOne();
      }
      if (user) {
        console.log('Removendo usuário após erro:', user._id);
        await user.deleteOne();
      }
      
      res.status(400);
      throw new Error('Erro ao criar funcionário');
    }
  } catch (error) {
    console.error('Erro detalhado ao criar funcionário:', error);
    res.status(500);
    throw new Error(`Erro ao criar funcionário: ${error.message}`);
  }
});

// @desc    Atualizar um funcionário
// @route   PUT /api/employees/:id
// @access  Private/Admin
export const updateEmployee = asyncHandler(async (req: Request, res: Response) => {
  const employee = await Employee.findById(req.params.id);
  const user = employee ? await User.findOne({ email: employee.email }) : null;

  console.log('Dados para atualização:', {
    employeeId: req.params.id,
    employeeFound: !!employee,
    userFound: !!user,
    updateData: req.body
  });

  if (employee) {
    // Se estiver atualizando o email, verificar se já está em uso
    if (req.body.email && req.body.email !== employee.email) {
      const emailExists = await Employee.findOne({ email: req.body.email });
      const userEmailExists = await User.findOne({ email: req.body.email });
      
      console.log('Verificação de email para atualização:', {
        emailExists: !!emailExists,
        userEmailExists: !!userEmailExists
      });
      
      if (emailExists || userEmailExists) {
        res.status(400);
        throw new Error('Este email já está em uso');
      }
    }

    try {
      // Atualizar funcionário
      employee.name = req.body.name || employee.name;
      employee.email = req.body.email || employee.email;
      
      // Se houver nova senha, fazer o hash
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        employee.password = hashedPassword;
      }
      
      employee.role = req.body.role || employee.role;
      employee.active = req.body.active !== undefined ? req.body.active : employee.active;

      const updatedEmployee = await employee.save();
      console.log('Funcionário atualizado:', { id: updatedEmployee._id, name: updatedEmployee.name });

      // Atualizar usuário correspondente
      if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(req.body.password, salt);
          user.password = hashedPassword;
        }
        user.role = req.body.role || user.role;
        user.active = req.body.active !== undefined ? req.body.active : user.active;
        
        const updatedUser = await user.save();
        console.log('Usuário atualizado:', { id: updatedUser._id, name: updatedUser.name });
      } else {
        console.log('Usuário não encontrado para atualização');
      }

      res.json({
        id: updatedEmployee._id,
        name: updatedEmployee.name,
        email: updatedEmployee.email,
        role: updatedEmployee.role,
        active: updatedEmployee.active
      });
    } catch (error) {
      console.error('Erro detalhado ao atualizar funcionário:', error);
      res.status(500);
      throw new Error(`Erro ao atualizar funcionário: ${error.message}`);
    }
  } else {
    res.status(404);
    throw new Error('Funcionário não encontrado');
  }
});

// @desc    Excluir um funcionário
// @route   DELETE /api/employees/:id
// @access  Private/Admin
export const deleteEmployee = asyncHandler(async (req: Request, res: Response) => {
  const employee = await Employee.findById(req.params.id);
  const user = employee ? await User.findOne({ email: employee.email }) : null;

  if (employee) {
    await employee.deleteOne();
    if (user) {
      await user.deleteOne();
    }
    res.json({ message: 'Funcionário removido' });
  } else {
    res.status(404);
    throw new Error('Funcionário não encontrado');
  }
}); 