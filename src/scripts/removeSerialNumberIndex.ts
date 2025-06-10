import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const removeIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || '');
    console.log('Conectado ao MongoDB');

    const collection = mongoose.connection.collection('equipment');
    await collection.dropIndex('serialNumber_1');
    console.log('Índice serialNumber_1 removido com sucesso');

    await mongoose.disconnect();
    console.log('Desconectado do MongoDB');
  } catch (error) {
    console.error('Erro:', error);
  }
};

removeIndex(); 