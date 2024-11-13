import { Schema, model, Document } from 'mongoose';
import { IModule } from '../typesAndinterfaces/IModuleInterface';



const moduleSchema = new Schema<IModule>({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
});

const Module = model<IModule>('Module', moduleSchema);

export default Module;
