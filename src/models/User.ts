import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  loginAttempts: number;
  lastLoginAttempt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true
  },
  coduser: {
    type: String,
    required: [true, 'Código do usuário é obrigatório'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lastLoginAttempt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Middleware para atualizar o updatedAt antes de salvar
userSchema.pre("save", function(next) {
  this.updatedAt = new Date();
  next();
});

export const User = mongoose.model<IUser>('User', userSchema); 