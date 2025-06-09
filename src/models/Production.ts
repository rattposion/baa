import mongoose from 'mongoose';
import { IProduction } from '../types';

const productionSchema = new mongoose.Schema<IProduction>(
  {
    employeeId: {
      type: String,
      required: [true, 'ID do funcionário é obrigatório'],
      ref: 'Employee',
    },
    employeeName: {
      type: String,
      required: [true, 'Nome do funcionário é obrigatório'],
    },
    equipmentId: {
      type: String,
      required: [true, 'ID do equipamento é obrigatório'],
      ref: 'Equipment',
    },
    equipmentModel: {
      type: String,
      required: [true, 'Modelo do equipamento é obrigatório'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantidade é obrigatória'],
      min: [1, 'Quantidade deve ser maior que zero'],
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
      transform: function (_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export default mongoose.model<IProduction>('Production', productionSchema); 