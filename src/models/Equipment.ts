import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEquipment {
  model: string;
}

export interface IEquipmentDocument extends Document {
  model: string;
  createdAt: Date;
  updatedAt: Date;
}

const equipmentSchema = new Schema({
  model: {
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