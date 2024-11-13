import mongoose, { Schema } from 'mongoose';
import { IProductCategory } from '../typesAndinterfaces/IProductCategoryInterface';

const ProductCategorySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  description:{type: String, required: false},// turn to required:true
  logoCategory: { type: String, required: false, default:"" }, 
  parentCategory: { 
    type: Schema.Types.ObjectId || String, 
    ref: 'ProductCategory',
     required: false },
     creationDate: { type: Date, default: Date.now },
}, { timestamps: true });

export const ProductCategory = mongoose.model<IProductCategory>('ProductCategory', ProductCategorySchema);