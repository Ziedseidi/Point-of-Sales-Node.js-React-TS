
import { Types } from 'mongoose';

export interface IStock {
  _id?: Types.ObjectId;
  product: Types.ObjectId;
  warehouse: Types.ObjectId;
  quantity: number;
}
