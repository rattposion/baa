import mongoose, { Schema, Document } from 'mongoose';

export interface IEquipment extends Document {
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

const Equipment = mongoose.model<IEquipment>('Equipment', equipmentSchema);

export default Equipment; 