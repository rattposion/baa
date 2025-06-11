import { Document, Types } from 'mongoose';

export interface IEmployee extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  active: boolean;
}

export interface IEquipment {
  modelName: string;
}

export interface IEquipmentDocument extends Document {
  modelName: string;
  createdAt: Date;
  updatedAt: Date;
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
  isReset?: boolean;
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
