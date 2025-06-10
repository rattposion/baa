import mongoose from 'mongoose';

const removeIndex = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/test');
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