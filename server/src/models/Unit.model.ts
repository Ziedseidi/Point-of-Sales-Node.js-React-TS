import mongoose, { Schema } from 'mongoose';
import { IUnit } from '../typesAndinterfaces/IUnitInterface';

const UnitSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  shortname: { type: String, required: true },
  baseunit: { type: String, required: true },
  creationDate: { type: Date, default: Date.now }

});

export const Unit = mongoose.model<IUnit>('Unit', UnitSchema);
