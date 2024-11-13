// src/models/Barcode.ts
import mongoose, { Schema } from 'mongoose';
import { IBarcode } from '../typesAndinterfaces/IBarcodeInterface';

const BarcodeSchema: Schema = new Schema({
  code: { type: String, required: true, unique: true }, // Code à barres unique
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, // Référence au produit
  warehouse: { type: Schema.Types.ObjectId, ref: 'Warehouse', required: false }, // Référence à l'entrepôt
  createdOn: { type: Date, default: Date.now }, // Date de création
});

export const Barcode = mongoose.model<IBarcode>('Barcode', BarcodeSchema);
