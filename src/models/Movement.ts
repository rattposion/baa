import mongoose from 'mongoose';
import { IMovement } from '../types';

const movementSchema = new mongoose.Schema<IMovement>(
  {
    equipmentId: {
      type: String,
      required: [true, 'ID do equipamento é obrigatório'],
      ref: 'Equipment',
    },
    equipmentName: {
      type: String,
      required: [true, 'Nome do equipamento é obrigatório'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantidade é obrigatória'],
      min: [1, 'Quantidade deve ser maior que zero'],
    },
    type: {
      type: String,
      enum: ['entrada', 'saida'],
      required: [true, 'Tipo é obrigatório'],
    },
    description: {
      type: String,
      required: [true, 'Descrição é obrigatória'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Data é obrigatória'],
    },
    timestamp: {
      type: Date,
      required: [true, 'Timestamp é obrigatório'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_: any, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export default mongoose.model<IMovement>('Movement', movementSchema); 