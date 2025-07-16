import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import SeparacaoMac from '../models/SeparacaoMac';

// @desc    Buscar todas as separações por data
// @route   GET /api/separacao-macs
// @access  Private
const getSeparacoesByDate = asyncHandler(async (req: Request, res: Response) => {
  const { date } = req.query;

  if (!date) {
    res.status(400);
    throw new Error('Data é obrigatória');
  }

  const separacoes = await SeparacaoMac.find({ date: date as string })
    .sort({ createdAt: -1 });

  res.json(separacoes);
});

// @desc    Criar nova separação
// @route   POST /api/separacao-macs
// @access  Private
const createSeparacao = asyncHandler(async (req: Request, res: Response) => {
  const {
    equipmentId,
    equipmentName,
    employeeId,
    employeeName,
    quantity,
    date,
    notes
  } = req.body;

  if (!equipmentId || !employeeId || !quantity || !date) {
    res.status(400);
    throw new Error('Todos os campos obrigatórios devem ser preenchidos');
  }

  const separacao = await SeparacaoMac.create({
    equipmentId,
    equipmentName,
    employeeId,
    employeeName,
    quantity,
    date,
    notes: notes || '',
    status: 'pendente'
  });

  res.status(201).json(separacao);
});

// @desc    Atualizar status da separação
// @route   PATCH /api/separacao-macs/:id
// @access  Private
const updateSeparacaoStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['pendente', 'em_separacao', 'concluido'].includes(status)) {
    res.status(400);
    throw new Error('Status inválido');
  }

  const separacao = await SeparacaoMac.findById(id);

  if (!separacao) {
    res.status(404);
    throw new Error('Separação não encontrada');
  }

  separacao.status = status;
  const updatedSeparacao = await separacao.save();

  res.json(updatedSeparacao);
});

// @desc    Buscar separação por ID
// @route   GET /api/separacao-macs/:id
// @access  Private
const getSeparacaoById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const separacao = await SeparacaoMac.findById(id);

  if (!separacao) {
    res.status(404);
    throw new Error('Separação não encontrada');
  }

  res.json(separacao);
});

// @desc    Deletar separação
// @route   DELETE /api/separacao-macs/:id
// @access  Private
const deleteSeparacao = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const separacao = await SeparacaoMac.findById(id);

  if (!separacao) {
    res.status(404);
    throw new Error('Separação não encontrada');
  }

  await SeparacaoMac.findByIdAndDelete(id);

  res.json({ message: 'Separação removida com sucesso' });
});

// @desc    Buscar todas as separações
// @route   GET /api/separacao-macs/all
// @access  Private
const getAllSeparacoes = asyncHandler(async (req: Request, res: Response) => {
  const separacoes = await SeparacaoMac.find()
    .sort({ createdAt: -1 })
    .limit(100);

  res.json(separacoes);
});

export {
  getSeparacoesByDate,
  createSeparacao,
  updateSeparacaoStatus,
  getSeparacaoById,
  deleteSeparacao,
  getAllSeparacoes
}; 