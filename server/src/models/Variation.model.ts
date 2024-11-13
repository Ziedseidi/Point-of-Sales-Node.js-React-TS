import mongoose, { Schema } from 'mongoose';
import { IVariation } from '../typesAndinterfaces/IVariationIntergace';

const VariationSchema: Schema = new Schema({
  name: { type: String, required: true },
  Variationtype: { type: [String], required: true }, 
});

export const Variation = mongoose.model<IVariation>('Variation', VariationSchema);
