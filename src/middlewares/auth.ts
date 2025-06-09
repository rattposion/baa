import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { Types } from 'mongoose';

interface JwtPayload {
  id: string;
}

interface UserPayload {
  id: string;
  role: 'admin' | 'user';
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        res.status(401).json({ message: 'Usuário não encontrado' });
        return;
      }

      req.user = {
        id: (user._id as Types.ObjectId).toString(),
        role: user.role as 'admin' | 'user'
      };
      
      next();
    } catch (error) {
      res.status(401).json({ message: 'Não autorizado, token inválido' });
      return;
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Não autorizado, sem token' });
    return;
  }
};

export const admin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Não autorizado como administrador' });
  }
}; 