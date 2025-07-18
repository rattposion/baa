import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Production from '../models/Production';
import User from '../models/User';
import Equipment from '../models/Equipment';

// @desc    Obter todos os registros de produção
// @route   GET /api/production
// @access  Private
export const getProduction = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { startDate, endDate, employeeId, equipmentId } = req.query;
  
  let query: any = {};
  
  if (startDate && endDate) {
    // Converte as strings de data para objetos Date para consulta no campo timestamp
    const startOfDay = new Date(startDate as string);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(endDate as string);
    endOfDay.setUTCHours(23, 59, 59, 999);

    query.timestamp = { $gte: startOfDay, $lte: endOfDay };
  } else if (startDate) {
    // Se apenas startDate for fornecido, considera o dia inteiro
    const startOfDay = new Date(startDate as string);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(startDate as string);
    endOfDay.setUTCHours(23, 59, 59, 999);
    
    query.timestamp = { $gte: startOfDay, $lte: endOfDay };
  }

  if (employeeId) {
    query.employeeId = employeeId;
  }
  
  if (equipmentId) {
    query.equipmentId = equipmentId;
  }

  const production = await Production.find(query)
    .sort({ timestamp: -1 });

  res.json(production);
});

// @desc    Obter um registro de produção por ID
// @route   GET /api/production/:id
// @access  Private
export const getProductionById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const production = await Production.findById(req.params.id);

  if (production) {
    res.json(production);
  } else {
    res.status(404);
    throw new Error('Registro de produção não encontrado');
  }
});

// @desc    Criar um registro de produção
// @route   POST /api/production
// @access  Private
export const createProduction = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { employeeId, equipmentId, quantity, date, isReset } = req.body;


  // Converter isReset para booleano
  const isResetBool = isReset === true || isReset === 'true';

  // Validar se os IDs são ObjectIds válidos
  if (!mongoose.Types.ObjectId.isValid(employeeId)) {
    res.status(400);
    throw new Error('ID do funcionário inválido');
  }

  if (!mongoose.Types.ObjectId.isValid(equipmentId)) {
    res.status(400);
    throw new Error('ID do equipamento inválido');
  }

  // Verificar se o funcionário existe
  const employee = await User.findById(employeeId);
  if (!employee) {
    res.status(404);
    throw new Error('Funcionário não encontrado');
  }

  // Verificar se o equipamento existe
  const equipment = await Equipment.findById(equipmentId);
  if (!equipment) {
    res.status(404);
    throw new Error('Equipamento não encontrado');
  }

  // Cria o registro de produção
  const production = await Production.create({
    employeeId,
    equipmentId,
    quantity,
    date,
    employeeName: employee.name,
    equipmentModel: equipment.get('modelName'),
    timestamp: new Date(),
    isReset: isResetBool,
  });

  // Se for reset, incrementa o campo totalResets do equipamento
  if (isResetBool) {
    equipment.totalResets = (equipment.totalResets || 0) + quantity;
    await equipment.save();
  }

  // Só movimenta estoque se NÃO for reset
  if (!isResetBool) {
    // Atualiza o estoque do equipamento
    equipment.currentStock = (equipment.currentStock || 0) + quantity;
    await equipment.save();

    // Cria o registro de movimentação
    const Movement = require('../models/Movement').default;
    await Movement.create({
      equipmentId,
      equipmentName: equipment.get('modelName'),
      quantity,
      type: 'entrada',
      description: `Entrada por produção - ${equipment.get('modelName')}`,
      date: date,
      timestamp: new Date(),
    });
  }

  res.status(201).json(production);
});

// @desc    Atualizar um registro de produção
// @route   PUT /api/production/:id
// @access  Private/Admin
export const updateProduction = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const production = await Production.findById(req.params.id);

  if (!production) {
    res.status(404);
    throw new Error('Registro de produção não encontrado');
  }

  if (req.body.employeeId) {
    if (!mongoose.Types.ObjectId.isValid(req.body.employeeId)) {
      res.status(400);
      throw new Error('ID do funcionário inválido');
    }

    const employee = await User.findById(req.body.employeeId);
    if (!employee) {
      res.status(404);
      throw new Error('Funcionário não encontrado');
    }
    production.set('employeeId', req.body.employeeId);
    production.set('employeeName', employee.name);
  }

  if (req.body.equipmentId) {
    if (!mongoose.Types.ObjectId.isValid(req.body.equipmentId)) {
      res.status(400);
      throw new Error('ID do equipamento inválido');
    }

    const equipment = await Equipment.findById(req.body.equipmentId);
    if (!equipment) {
      res.status(404);
      throw new Error('Equipamento não encontrado');
    }
    production.set('equipmentId', req.body.equipmentId);
    production.set('equipmentModel', equipment.get('modelName'));
  }

  if (req.body.quantity) {
    production.set('quantity', req.body.quantity);
  }

  if (req.body.date) {
    production.set('date', req.body.date);
  }

  const updatedProduction = await production.save();
  res.json(updatedProduction);
});

// @desc    Excluir um registro de produção
// @route   DELETE /api/production/:id
// @access  Private/Admin
export const deleteProduction = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const production = await Production.findById(req.params.id);

  if (!production) {
    res.status(404);
    throw new Error('Registro de produção não encontrado');
  }

  await production.deleteOne();
  res.json({ message: 'Registro de produção removido' });
}); 