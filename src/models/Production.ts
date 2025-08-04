import mongoose from 'mongoose';
import { ProductionSchemaType } from '../types';

const productionSchema = new mongoose.Schema<ProductionSchemaType>(
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
    isReset: {
      type: Boolean,
      default: false,
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

// Índice único para evitar duplicações de produção no mesmo dia
productionSchema.index(
  { employeeId: 1, equipmentId: 1, date: 1, isReset: 1 },
  { unique: true, name: 'unique_production_per_day' }
);

export default mongoose.model('Production', productionSchema); 