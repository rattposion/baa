import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por favor, informe o nome do equipamento'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Por favor, informe o modelo do equipamento'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Por favor, informe a descrição do equipamento'],
    trim: true
  },
  minStock: {
    type: Number,
    required: [true, 'Por favor, informe o estoque mínimo'],
    default: 0
  },
  currentStock: {
    type: Number,
    required: [true, 'Por favor, informe o estoque atual'],
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (_, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

const Equipment = mongoose.model('Equipment', equipmentSchema);

export default Equipment; 