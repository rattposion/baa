import { Request, Response } from 'express';
import Employee, { IEmployee } from '../models/Employee';

// Buscar todos os funcionários
export const getEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar funcionários', error });
  }
};

// Criar novo funcionário
export const createEmployee = async (req: Request, res: Response) => {
  try {
    const employee = new Employee(req.body);
    const savedEmployee = await employee.save();
    res.status(201).json(savedEmployee);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar funcionário', error });
  }
};

// Atualizar funcionário
export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    
    if (!employee) {
      return res.status(404).json({ message: 'Funcionário não encontrado' });
    }
    
    res.status(200).json(employee);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar funcionário', error });
  }
};

// Deletar funcionário
export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findByIdAndDelete(id);
    
    if (!employee) {
      return res.status(404).json({ message: 'Funcionário não encontrado' });
    }
    
    res.status(200).json({ message: 'Funcionário removido com sucesso' });
  } catch (error) {
    res.status(400).json({ message: 'Erro ao deletar funcionário', error });
  }
};

// Buscar funcionário por ID
export const getEmployeeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);
    
    if (!employee) {
      return res.status(404).json({ message: 'Funcionário não encontrado' });
    }
    
    res.status(200).json(employee);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao buscar funcionário', error });
  }
}; 