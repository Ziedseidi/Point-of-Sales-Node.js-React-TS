// models/Permissionmodel.ts
import { Schema, model } from 'mongoose';

const permissionSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true }
});

const Permission = model('Permission', permissionSchema);

export default Permission;
