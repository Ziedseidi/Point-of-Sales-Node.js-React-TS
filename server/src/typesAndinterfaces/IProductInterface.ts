// src/typesAndinterfaces/IProductInterface.ts

import { Types } from 'mongoose';

export interface IProduct {
  _id?: Types.ObjectId;
  name: string;
  code: string;
  productImg: string;
  brand: Types.ObjectId;
  category: Types.ObjectId;
  barcodeSymbology: string;
  saleUnit: Types.ObjectId;
  purchaseUnit: Types.ObjectId;
  productUnit: Types.ObjectId;
  quantityLimitation: number;
  note: string;
  variations: Types.ObjectId[];
  price: number;
  cost: number
  supplier: Types.ObjectId;
  stockAlert: number,
  orderTax: number,
  taxType: string,
  creationDate?: Date;
}
