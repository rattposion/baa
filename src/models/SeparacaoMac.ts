import mongoose, { Schema, Document } from 'mongoose';

export interface ISeparacaoMac extends Document {
  equipmentId: mongoose.Types.ObjectId;
  equipmentName: string;
  employeeId: mongoose.Types.ObjectId;
  employeeName: string;
  quantity: number;
  date: string;
  status: 'pendente' | 'em_separacao' | 'concluido';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SeparacaoMacSchema = new Schema<ISeparacaoMac>({
  equipmentId: {
    type: Schema.Types.ObjectId,
    ref: 'Equipment',
    required: true
  },
  equipmentName: {
    type: String,
    required: true
  },
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  employeeName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  date: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pendente', 'em_separacao', 'concluido'],
    default: 'pendente'
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Índice para melhorar performance de consultas por data
SeparacaoMacSchema.index({ date: 1 });
SeparacaoMacSchema.index({ status: 1 });
SeparacaoMacSchema.index({ employeeId: 1 });

export default mongoose.model<ISeparacaoMac>('SeparacaoMac', SeparacaoMacSchema); 