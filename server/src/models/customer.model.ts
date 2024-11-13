import mongoose, { Schema } from 'mongoose';
import { ICustomer } from '../typesAndinterfaces/ICustomerInterface';

const CustomerSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String  , required: true },
  phone: { type:Number, required: true },
  dob:{type:Date},
  country: { type: String, required: true },
  city: { type: String, required: true },
  adress: { type: String, required: true },
  createdOn: { type: Date, default: Date.now }
 
});

export const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema);
