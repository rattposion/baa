import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const createProductionIndex = async () => {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mix_production');
    console.log('Conectado ao MongoDB');

    // Obter a coleção de produção
    const db = mongoose.connection.db;
    const productionCollection = db.collection('productions');

    // Criar o índice único
    await productionCollection.createIndex(
      { employeeId: 1, equipmentId: 1, date: 1, isReset: 1 },
      { unique: true, name: 'unique_production_per_day' }
    );

    console.log('Índice único criado com sucesso para evitar duplicações de produção');

    // Verificar se há duplicações existentes
    const duplicates = await productionCollection.aggregate([
      {
        $group: {
          _id: {
            employeeId: '$employeeId',
            equipmentId: '$equipmentId',
            date: '$date',
            isReset: '$isReset'
          },
          count: { $sum: 1 },
          docs: { $push: '$_id' }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ]).toArray();

    if (duplicates.length > 0) {
      console.log(`Encontradas ${duplicates.length} duplicações de produção:`);
      duplicates.forEach((dup, index) => {
        console.log(`Duplicação ${index + 1}:`, dup);
      });
    } else {
      console.log('Nenhuma duplicação encontrada');
    }

    process.exit(0);
  } catch (error) {
    console.error('Erro ao criar índice:', error);
    process.exit(1);
  }
};

createProductionIndex(); 