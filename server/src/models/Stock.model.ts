// src/models/Stock.ts

import mongoose, { Schema } from 'mongoose';
import { IStock } from '../typesAndinterfaces/IStockInterface';

const StockSchema: Schema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  warehouse: { type: Schema.Types.ObjectId, ref: 'Warehouse', required: true },
  quantity: { type: Number },
  createdOn: { type: Date, default: Date.now }
});

export const Stock = mongoose.model<IStock>('Stock', StockSchema);
