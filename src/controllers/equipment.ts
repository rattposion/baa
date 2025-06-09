import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Equipment from '../models/Equipment';

// @desc    Obter todos os equipamentos
// @route   GET /api/equipment
// @access  Private
export const getEquipment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const equipment = await Equipment.find();
  res.json(equipment);
});

// @desc    Obter um equipamento específico
// @route   GET /api/equipment/:id
// @access  Private
export const getEquipmentById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const equipment = await Equipment.findById(req.params.id);

  if (equipment) {
    res.json(equipment);
  } else {
    res.status(404);
    throw new Error('Equipamento não encontrado');
  }
});

// @desc    Criar um novo equipamento
// @route   POST /api/equipment
// @access  Private/Admin
export const createEquipment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name, model, description, minStock, currentStock } = req.body;

  const equipment = await Equipment.create({
    name,
    model,
    description,
    minStock: minStock || 0,
    currentStock: currentStock || 0
  });

  res.status(201).json(equipment);
});

// @desc    Atualizar um equipamento
// @route   PUT /api/equipment/:id
// @access  Private/Admin
export const updateEquipment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name, model, description, minStock, currentStock, active } = req.body;

  const equipment = await Equipment.findById(req.params.id);

  if (equipment) {
    equipment.name = name || equipment.name;
    equipment.model = model || equipment.model;
    equipment.description = description || equipment.description;
    equipment.minStock = minStock !== undefined ? minStock : equipment.minStock;
    equipment.currentStock = currentStock !== undefined ? currentStock : equipment.currentStock;
    equipment.active = active !== undefined ? active : equipment.active;

    const updatedEquipment = await equipment.save();
    res.json(updatedEquipment);
  } else {
    res.status(404);
    throw new Error('Equipamento não encontrado');
  }
});

// @desc    Excluir um equipamento
// @route   DELETE /api/equipment/:id
// @access  Private/Admin
export const deleteEquipment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const equipment = await Equipment.findById(req.params.id);

  if (equipment) {
    await equipment.deleteOne();
    res.json({ message: 'Equipamento removido' });
  } else {
    res.status(404);
    throw new Error('Equipamento não encontrado');
  }
}); 