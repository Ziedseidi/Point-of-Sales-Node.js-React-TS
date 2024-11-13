import { Document } from 'mongoose';

export interface IVariation extends Document {
  name: string;
  Variationtype: string[];
}
