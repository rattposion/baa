import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Movement from '../models/Movement';
import Equipment from '../models/Equipment';

// @desc    Obter todas as movimentações
// @route   GET /api/movements
// @access  Private
export const getMovements = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { startDate, endDate, equipmentId, type } = req.query;
  
  let query: any = {};
  
  if (startDate && endDate) {
    query.date = { $gte: startDate, $lte: endDate };
  }
  
  if (equipmentId) {
    query.equipmentId = equipmentId;
  }
  
  if (type) {
    query.type = type;
  }

  const movements = await Movement.find(query)
    .sort({ timestamp: -1 });
  
  res.json(movements);
});

// @desc    Obter uma movimentação por ID
// @route   GET /api/movements/:id
// @access  Private
export const getMovementById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const movement = await Movement.findById(req.params.id);

  if (movement) {
    res.json(movement);
  } else {
    res.status(404);
    throw new Error('Movimentação não encontrada');
  }
});

// @desc    Criar uma movimentação
// @route   POST /api/movements
// @access  Private
export const createMovement = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  console.log('Body recebido na movimentação:', req.body);
  const { equipmentId, quantity, type, description, date } = req.body;

  // Verificar se o equipamento existe
  const equipment = await Equipment.findById(equipmentId);
  if (!equipment) {
    res.status(404);
    throw new Error('Equipamento não encontrado');
  }

  const movement = await Movement.create({
    equipmentId,
    quantity,
    type,
    description,
    date,
    equipmentName: equipment.get('model'),
    timestamp: new Date(),
  });

  res.status(201).json(movement);
});

// @desc    Atualizar uma movimentação
// @route   PUT /api/movements/:id
// @access  Private/Admin
export const updateMovement = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const movement = await Movement.findById(req.params.id);

  if (!movement) {
    res.status(404);
    throw new Error('Movimentação não encontrada');
  }

  if (req.body.equipmentId) {
    const equipment = await Equipment.findById(req.body.equipmentId);
    if (!equipment) {
      res.status(404);
      throw new Error('Equipamento não encontrado');
    }
    movement.set('equipmentId', req.body.equipmentId);
    movement.set('equipmentName', equipment.get('model'));
  }

  if (req.body.quantity) {
    movement.set('quantity', req.body.quantity);
  }

  if (req.body.type) {
    movement.set('type', req.body.type);
  }

  if (req.body.description) {
    movement.set('description', req.body.description);
  }

  if (req.body.date) {
    movement.set('date', req.body.date);
  }

  const updatedMovement = await movement.save();
  res.json(updatedMovement);
});

// @desc    Excluir uma movimentação
// @route   DELETE /api/movements/:id
// @access  Private/Admin
export const deleteMovement = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const movement = await Movement.findById(req.params.id);

  if (!movement) {
    res.status(404);
    throw new Error('Movimentação não encontrada');
  }

  await movement.deleteOne();
  res.json({ message: 'Movimentação removida' });
}); 