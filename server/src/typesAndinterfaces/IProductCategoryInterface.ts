import { Document } from 'mongoose';

export interface IProductCategory extends Document {
  name: string;
  description: string;  // Ajout de description
  logoCategory?: string;
  parentCategory?: string | IProductCategory;
  creationDate?: Date;
}
