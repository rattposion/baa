import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Equipment from '../models/Equipment';

// @desc    Obter todos os equipamentos
// @route   GET /api/equipment
// @access  Private
export const getEquipments = asyncHandler(async (_req: Request, res: Response) => {
  const equipment = await Equipment.find().sort({ modelName: 1 });
  res.json(equipment);
});

// @desc    Obter equipamento por ID
// @route   GET /api/equipment/:id
// @access  Private
export const getEquipmentById = asyncHandler(async (req: Request, res: Response) => {
  const equipment = await Equipment.findById(req.params.id);
  
  if (equipment) {
    res.json(equipment);
  } else {
    res.status(404);
    throw new Error('Equipamento não encontrado');
  }
});

// @desc    Criar equipamento
// @route   POST /api/equipment
// @access  Private/Admin
export const createEquipment = asyncHandler(async (req: Request, res: Response) => {
  const { modelName } = req.body;

  // Validar campos obrigatórios
  if (!modelName) {
    res.status(400);
    throw new Error('Por favor, informe o modelo do equipamento');
  }

  // Verificar se já existe um equipamento com o mesmo modelo
  const existingEquipment = await Equipment.findOne({ modelName });
  if (existingEquipment) {
    res.status(400);
    throw new Error('Já existe um equipamento com este modelo');
  }

  const equipment = await Equipment.create({ modelName });
  res.status(201).json(equipment);
});

// @desc    Atualizar equipamento
// @route   PUT /api/equipment/:id
// @access  Private/Admin
export const updateEquipment = asyncHandler(async (req: Request, res: Response) => {
  const equipment = await Equipment.findById(req.params.id);

  if (equipment) {
    // Verificar se já existe outro equipamento com o mesmo modelo
    if (req.body.modelName && req.body.modelName !== equipment.modelName) {
      const existingEquipment = await Equipment.findOne({ modelName: req.body.modelName });
      if (existingEquipment) {
        res.status(400);
        throw new Error('Já existe um equipamento com este modelo');
      }
    }

    equipment.modelName = req.body.modelName || equipment.modelName;
    const updatedEquipment = await equipment.save();
    res.json(updatedEquipment);
  } else {
    res.status(404);
    throw new Error('Equipamento não encontrado');
  }
});

// @desc    Excluir equipamento
// @route   DELETE /api/equipment/:id
// @access  Private/Admin
export const deleteEquipment = asyncHandler(async (req: Request, res: Response) => {
  const equipment = await Equipment.findById(req.params.id);

  if (equipment) {
    await equipment.deleteOne();
    res.json({ message: 'Equipamento removido' });
  } else {
    res.status(404);
    throw new Error('Equipamento não encontrado');
  }
}); 