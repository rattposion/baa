import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';

// @desc    Registrar usuário
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('Usuário já existe');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id),
    });
  } else {
    res.status(400);
    throw new Error('Dados de usuário inválidos');
  }
});

// @desc    Login do usuário
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Busca o usuário incluindo o campo password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      res.status(401);
      throw new Error('Email ou senha inválidos');
    }

    // Verifica se a senha está correta
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401);
      throw new Error('Email ou senha inválidos');
    }

    // Verifica se o usuário está ativo
    if (!user.active) {
      res.status(401);
      throw new Error('Conta desativada');
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id),
    });
  } catch (error: any) {
    res.status(error.status || 500);
    throw error;
  }
});

// @desc    Obter perfil do usuário
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.user?.id);

  if (user) {
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(404);
    throw new Error('Usuário não encontrado');
  }
});

// Gerar token JWT
const generateToken = (id: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET não está definido');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
}; 