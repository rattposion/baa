import express from 'express';
import { register, login, getProfile } from '../controllers/auth';
import { protect } from '../middlewares/auth';
import bcrypt from 'bcryptjs';
import User from '../models/User';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);

// Rota temporária para criar admin
router.post('/create-admin', async (req, res) => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      return res.status(400).json({ message: 'Já existe um usuário administrador' });
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