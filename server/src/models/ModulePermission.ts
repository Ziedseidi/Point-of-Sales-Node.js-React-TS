import { Schema, model, Document } from 'mongoose';
import { IModulePermission } from '../typesAndinterfaces/IModulePermission';

const ModulePermissionSchema = new Schema<IModulePermission>({
  module: { type: String, required: true },
  permissions: [{ type: String, ref: 'Permission', required: true }],
});

const ModulePermission = model<IModulePermission>('ModulePermission', ModulePermissionSchema);

export default ModulePermission;
