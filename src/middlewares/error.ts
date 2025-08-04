import { Request, Response, NextFunction } from 'express';

interface ErrorResponse extends Error {
  statusCode?: number;
  code?: number;
  errors?: any;
}

export const errorHandler = (
  err: ErrorResponse,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  // Log detalhado do erro para o desenvolvedor
  console.error('=== ERRO DETALHADO ===');
  console.error('Mensagem:', err.message);
  console.error('Nome:', err.name);
  console.error('Código:', err.code);
  console.error('Stack:', err.stack);
  console.error('========================');

  // Mongoose erro de ID inválido
  if (err.name === 'CastError') {
    const message = 'Recurso não encontrado';
    error = new Error(message) as ErrorResponse;
    error.statusCode = 404;
  }

  // Mongoose erro de validação
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors!).map((val: any) => val.message);
    error = new Error(message.join(', ')) as ErrorResponse;
    error.statusCode = 400;
  }

  // Mongoose erro de duplicidade
  if (err.code === 11000) {
    const message = 'Valor duplicado inserido';
    error = new Error(message) as ErrorResponse;
    error.statusCode = 400;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Erro do servidor',
  });
}; 