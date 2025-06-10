import mongoose, { Schema, Document } from 'mongoose';

export interface IEquipment {
  modelName: string;
}

export interface IEquipmentDocument extends Document {
  modelName: string;
  createdAt: Date;
  updatedAt: Date;
}

const equipmentSchema = new Schema({
  modelName: {
    type: String,
    required: [true, 'Por favor, informe o modelo do equipamento'],
    trim: true,
    unique: true
  }
}, {
  timestamps: true
});

const Equipment = mongoose.model<IEquipmentDocument>('Equipment', equipmentSchema);

export default Equipment; 