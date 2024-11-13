// src/models/Product.ts

import mongoose, { Schema } from 'mongoose';
import { IProduct } from '../typesAndinterfaces/IProductInterface';

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  //productImg:{type:String,unique:false},
  brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
  category: { type: Schema.Types.ObjectId, ref: 'ProductCategory', required: true },
  barcodeSymbology: { type: String, required: true },
  saleUnit: { type: Schema.Types.ObjectId, ref: 'Unit', required: true },
  purchaseUnit: { type: Schema.Types.ObjectId, ref: 'Unit', required: true },
  productUnit: { type: Schema.Types.ObjectId, ref: 'Unit', required: true },
  quantityLimitation: { type: Number, required: true },
  note: { type: String, required: true },
  //variations: [{ type: Schema.Types.ObjectId, ref: 'Variation' }],
  price: { type: Number, required: true },
  cost:{type: Number, required: true },
  supplier: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
  stockAlert: {type: Number, required: true},
  orderTax: {type: Number, required: true},
  taxType:{type: String, required: true, enum: ['Exclusive', 'Inclusive']},  
  creationDate: { type: Date, default: Date.now },

});

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
