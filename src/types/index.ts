import { Document, Types } from 'mongoose';

export interface IEmployee extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  active: boolean;
}

export interface IEquipment {
  id?: string;
  model: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IEquipmentDocument extends Omit<Document, '_id' | 'model'>, IEquipment {
  _id: Types.ObjectId;
}

export interface IProduction extends Document {
  employeeId: string;
  employeeName: string;
  equipmentId: string;
  equipmentModel: string;
  quantity: number;
  date: string;
  timestamp: Date;
}

export interface IMovement extends Document {
  equipmentId: string;
  equipmentName: string;
  quantity: number;
  type: 'entrada' | 'saida';
  description: string;
  date: string;
  timestamp: Date;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  active: boolean;
} 