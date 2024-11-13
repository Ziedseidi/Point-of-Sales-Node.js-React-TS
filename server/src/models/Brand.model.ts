// src/models/Brand.ts
import mongoose, { Schema } from 'mongoose';
import { IBrand } from '../typesAndinterfaces/IBrandInterface'; 

const BrandSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  logoBrand: { type: String, required: true }, // Ajout de logoBrand
});

export const Brand = mongoose.model<IBrand>('Brand', BrandSchema);
