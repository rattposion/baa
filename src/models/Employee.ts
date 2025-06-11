import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IEmployee extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  active: boolean;
  department?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const employeeSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Por favor, informe o nome do funcionário'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Por favor, informe o email'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Por favor, informe um email válido']
  },
  password: {
    type: String,
    required: [true, 'Por favor, informe a senha'],
    minlength: [6, 'A senha deve ter no mínimo 6 caracteres'],
    select: false // Não retorna a senha nas consultas por padrão
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  active: {
    type: Boolean,
    default: true
  },
  department: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Hash da senha antes de salvar
employeeSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Método para comparar senhas
employeeSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    // Como o campo password está com select: false, precisamos incluí-lo explicitamente
    const employee = await this.model('Employee').findById(this._id).select('+password');
    if (!employee) return false;
    
    return bcrypt.compare(candidatePassword, employee.password);
  } catch (error) {
    return false;
  }
};

const Employee = mongoose.model<IEmployee>('Employee', employeeSchema);

export default Employee; 