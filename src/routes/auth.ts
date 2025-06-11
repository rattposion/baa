import express, { Request, Response } from 'express';
import { register, login, getProfile, listPendingUsers, approveUser, listAllUsers } from '../controllers/auth';
import { protect } from '../middlewares/auth';
import bcrypt from 'bcryptjs';
import User from '../models/User';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);

// Listar usuários pendentes
router.get('/pending', listPendingUsers);
// Aprovar usuário
router.patch('/approve/:id', approveUser);

// Listar todos os usuários cadastrados
router.get('/all', listAllUsers);

// Rota temporária para criar admin
router.post('/create-admin', async (_req: Request, res: Response): Promise<void> => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      res.status(400).json({ message: 'Já existe um usuário administrador' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('Wesley26.', salt);

    const admin = await User.create({
      name: 'Administrador',
      email: 'sl2br21@gmail.com',
      password,
      role: 'admin',
      active: true,
    });

    res.status(201).json({
      message: 'Usuário administrador criado com sucesso',
      email: admin.email
    });
  } catch (error) {
    console.error('Erro ao criar usuário administrador:', error);
    res.status(500).json({ message: 'Erro ao criar usuário administrador' });
  }
});

export default router; 