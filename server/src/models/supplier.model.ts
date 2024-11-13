import mongoose, { Schema } from 'mongoose';
import { ISupplier } from '../typesAndinterfaces/ISupplierInterface';

const SupplierSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String  , required: true },
  phone: { type:Number, required: true },
  country: { type: String, required: true },
  city: { type: String, required: true },
  adress: { type: String, required: true },
  createdOn: { type: Date, default: Date.now }
 
});

export const Supplier = mongoose.model<ISupplier>('Supplier', SupplierSchema);
