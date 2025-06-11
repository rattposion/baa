import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import asyncHandler from 'express-async-handler';

// @desc    Registrar usuário
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Por favor, preencha todos os campos');
  }

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
      token: generateToken(user.id, user.role),
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

    if (!email || !password) {
      res.status(400);
      throw new Error('Por favor, informe email e senha');
    }

    // Busca o usuário incluindo o campo password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      res.status(401);
      throw new Error('Email ou senha inválidos');
    }

    // Verifica se o usuário está ativo
    if (!user.active) {
      res.status(401);
      throw new Error('Conta desativada');
    }

    // Verifica se a senha está correta
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      res.status(401);
      throw new Error('Email ou senha inválidos');
    }

    try {
      const token = generateToken(user.id, user.role);
      
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      });
    } catch (tokenError) {
      console.error('Erro ao gerar token:', tokenError);
      res.status(500);
      throw new Error('Erro ao gerar token de autenticação');
    }
  } catch (error: any) {
    console.error('Erro no login:', error);
    // Se for um erro que já definiu o status, mantém o status
    if (!res.statusCode || res.statusCode === 200) {
      res.status(401);
    }
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
const generateToken = (id: string, role: string): string => {
  const jwtSecret = process.env.JWT_SECRET;
  
  if (!jwtSecret) {
    console.error('JWT_SECRET não está definido no ambiente');
    throw new Error('Erro de configuração do servidor');
  }

  try {
    return jwt.sign({ id, role }, jwtSecret, {
      expiresIn: '30d',
    });
  } catch (error) {
    console.error('Erro ao assinar token JWT:', error);
    throw new Error('Erro ao gerar token de autenticação');
  }
}; 
