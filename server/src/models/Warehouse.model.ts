// src/models/Warehouse.ts

import mongoose, { Schema } from 'mongoose';
import { IWarehouse } from '../typesAndinterfaces/IWarehouseInterface';

const WarehouseSchema: Schema = new Schema({
  name: { type: String, required: true, unique: false },
  emailwarehouse: { type: String, required: true, unique: false },
  phone: { type: String, required: true },
  country: { type: String, required: true },
  zipcode: { type: String, required: true },
  city: { type: String, required: true },
  createdOn: { type: Date, default: Date.now }
});

export const Warehouse = mongoose.model<IWarehouse>('Warehouse', WarehouseSchema);
