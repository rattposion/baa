import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Equipment from '../models/Equipment';

// @desc    Obter todos os equipamentos
// @route   GET /api/equipment
// @access  Private
export const getEquipment = asyncHandler(async (_req: Request, res: Response) => {
  const equipment = await Equipment.find().sort({ modelName: 1 });
  console.log('Equipamentos encontrados no banco (raw):', equipment);
  
  // Aplicar transform manualmente para garantir que os IDs sejam incluídos
  const equipmentWithId = equipment.map(eq => {
    const json = eq.toJSON();
    console.log('Equipamento após toJSON:', json);
    return json;
  });
  
  console.log('Equipamentos com ID:', equipmentWithId);
  res.json(equipmentWithId);
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
  try {
    const { modelName } = req.body;

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
  } catch (error: any) {
    // Se for um erro de duplicidade do MongoDB
    if (error.code === 11000) {
      res.status(400);
      throw new Error('Já existe um equipamento com este modelo');
    }
    
    // Se for um erro de validação do Mongoose
    if (error.name === 'ValidationError') {
      res.status(400);
      throw new Error(error.message);
    }

    // Para outros erros, registra o erro completo
    console.error('Erro ao criar equipamento:', error);
    res.status(500);
    throw new Error('Erro ao criar equipamento. Por favor, tente novamente.');
  }
});

// @desc    Atualizar um equipamento
// @route   PUT /api/equipment/:id
// @access  Private/Admin
export const updateEquipment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { modelName } = req.body;

  const equipment = await Equipment.findById(req.params.id);

  if (equipment) {
    // Verificar se já existe outro equipamento com o mesmo modelo
    if (modelName && modelName !== equipment.modelName) {
      const existingEquipment = await Equipment.findOne({ modelName });
      if (existingEquipment) {
        res.status(400);
        throw new Error('Já existe um equipamento com este modelo');
      }
    }

    equipment.modelName = modelName || equipment.modelName;

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