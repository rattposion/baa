import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUserMethods {
  matchPassword(enteredPassword: string): Promise<boolean>;
}

interface IUserDocument extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  active: boolean;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

type UserModel = mongoose.Model<IUserDocument, {}, IUserMethods>;

const userSchema = new mongoose.Schema<IUserDocument, UserModel, IUserMethods>(
  {
    name: {
      type: String,
      required: [true, 'Nome é obrigatório'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email é obrigatório'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Por favor, use um email válido'],
    },
    password: {
      type: String,
      required: [true, 'Senha é obrigatória'],
      minlength: [6, 'A senha deve ter no mínimo 6 caracteres'],
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    active: {
      type: Boolean,
      default: true,
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
        delete ret.password;
        return ret;
      },
    },
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  if (!enteredPassword) {
    throw new Error('Senha não fornecida');
  }

  const user = await this.model('User').findById(this._id).select('+password') as IUserDocument;
  
  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  if (!user.password) {
    throw new Error('Senha não definida para este usuário');
  }

  return await bcrypt.compare(enteredPassword, user.password);
};

export default mongoose.model<IUserDocument, UserModel>('User', userSchema); 