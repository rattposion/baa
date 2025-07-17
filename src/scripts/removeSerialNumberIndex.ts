import mongoose from 'mongoose';

const removeIndex = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/test');
  

    const collection = mongoose.connection.collection('equipment');
          await collection.dropIndex('serialNumber_1');

    await mongoose.disconnect();

  } catch (error) {
    console.error('Erro:', error);
  }
};

removeIndex(); 