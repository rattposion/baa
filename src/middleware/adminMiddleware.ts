import { Request, Response, NextFunction } from 'express';

export const isAdmin = (req: Request, res: Response, next: NextFunction): Response | void => {
  if (!req.user) {
    return res.status(401).json({ message: 'Usuário não autenticado' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado. Apenas administradores podem realizar esta ação.' });
  }

  return next();
}; 