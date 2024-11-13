 import { Schema } from "mongoose";
 export interface IModulePermission extends Document {
    module: Schema.Types.ObjectId;
    permissions: Schema.Types.ObjectId[];
  }