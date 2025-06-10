import { Request, Response } from 'express';
import Equipment from '../models/Equipment';

// Buscar todos os equipamentos
export const getEquipments = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const equipments = await Equipment.find();
    return res.status(200).json(equipments);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar equipamentos', error });
  }
};

// Criar novo equipamento
export const createEquipment = async (req: Request, res: Response): Promise<Response> => {
  try {
    const equipment = new Equipment(req.body);
    const savedEquipment = await equipment.save();
    return res.status(201).json(savedEquipment);
  } catch (error) {
    return res.status(400).json({ message: 'Erro ao criar equipamento', error });
  }
};

// Atualizar equipamento
export const updateEquipment = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const equipment = await Equipment.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    
    if (!equipment) {
      return res.status(404).json({ message: 'Equipamento não encontrado' });
    }
    
    return res.status(200).json(equipment);
  } catch (error) {
    return res.status(400).json({ message: 'Erro ao atualizar equipamento', error });
  }
};

// Deletar equipamento
export const deleteEquipment = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const equipment = await Equipment.findByIdAndDelete(id);
    
    if (!equipment) {
      return res.status(404).json({ message: 'Equipamento não encontrado' });
    }
    
    return res.status(200).json({ message: 'Equipamento removido com sucesso' });
  } catch (error) {
    return res.status(400).json({ message: 'Erro ao deletar equipamento', error });
  }
};

// Buscar equipamento por ID
export const getEquipmentById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const equipment = await Equipment.findById(id);
    
    if (!equipment) {
      return res.status(404).json({ message: 'Equipamento não encontrado' });
    }
    
    return res.status(200).json(equipment);
  } catch (error) {
    return res.status(400).json({ message: 'Erro ao buscar equipamento', error });
  }
}; 