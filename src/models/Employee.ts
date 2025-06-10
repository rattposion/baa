import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployee extends Document {
  name: string;
  department: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EmployeeSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Departamento é obrigatório'],
    trim: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IEmployee>('Employee', EmployeeSchema); 