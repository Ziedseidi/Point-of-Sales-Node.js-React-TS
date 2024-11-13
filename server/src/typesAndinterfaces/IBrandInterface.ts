// src/interfaces/IBrand.ts
import { Document } from 'mongoose';

export interface IBrand extends Document {
  name: string;
  logoBrand: string;
}
