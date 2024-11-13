import { Document } from 'mongoose';

export interface IUnit extends Document {
  name: string;
  shortname: string;
  baseunit: string;
}
