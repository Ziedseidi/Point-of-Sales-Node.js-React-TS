import mongoose, { Schema, Document } from 'mongoose';
import { IRole } from '../typesAndinterfaces/IRoleInterface';

const roleSchema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    modulePermissions: [{
        module: { type: String, required: true },
        permissions: [{ type: String, required: true }]
    }]
});

export interface IRoleDocument extends IRole, Document {}

const Role = mongoose.model<IRoleDocument>('Role', roleSchema);
export default Role;
