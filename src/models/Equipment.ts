import mongoose, { Schema, Document } from 'mongoose';

export interface IEquipment extends Document {
  name: string;
  type: string;
  status: 'operational' | 'maintenance' | 'inactive';
  serialNumber: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const EquipmentSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Tipo é obrigatório'],
    trim: true
  },
  status: {
    type: String,
    enum: ['operational', 'maintenance', 'inactive'],
    default: 'operational'
  },
  serialNumber: {
    type: String,
    required: [true, 'Número de série é obrigatório'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IEquipment>('Equipment', EquipmentSchema); 