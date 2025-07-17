import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';

dotenv.config();

const createAdmin = async () => {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mix_production');
  

    // Verificar se já existe um admin
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
  
      process.exit(0);
    }

    // Criar senha hash
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('admin123', salt);

    // Criar usuário admin
    await User.create({
      name: 'Administrador',
      email: 'admin@mix.com',
      password,
      role: 'admin',
      active: true,
    });



    process.exit(0);
  } catch (error) {
    console.error('Erro ao criar usuário administrador:', error);
    process.exit(1);
  }
};

createAdmin(); 