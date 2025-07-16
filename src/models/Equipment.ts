import mongoose, { Schema, Document } from 'mongoose';

export interface IEquipment {
  modelName: string;
  currentStock: number;
  totalResets: number;
}

export interface IEquipmentDocument extends Document {
  modelName: string;
  currentStock: number;
  totalResets: number;
  createdAt: Date;
  updatedAt: Date;
}

const equipmentSchema = new Schema({
  modelName: {
    type: String,
    required: [true, 'Por favor, informe o modelo do equipamento'],
    trim: true,
    unique: true
  },
  currentStock: {
    type: Number,
    required: true,
    default: 0
  },
  totalResets: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
});

// Remove o índice serialNumber_1 se ele existir
mongoose.connection.on('connected', async () => {
  try {
    const collection = mongoose.connection.collection('equipment');
    const indexes = await collection.indexes();
    const hasSerialNumberIndex = indexes.some(index => index.name === 'serialNumber_1');
    
    if (hasSerialNumberIndex) {
      await collection.dropIndex('serialNumber_1');
      console.log('Índice serialNumber_1 removido com sucesso');
    }
  } catch (error) {
    console.error('Erro ao remover índice:', error);
  }
});

const Equipment = mongoose.model<IEquipmentDocument>('Equipment', equipmentSchema);

export default Equipment; 