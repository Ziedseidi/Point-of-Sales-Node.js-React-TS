import { Document } from 'mongoose';
import { IProduct } from './IProductInterface';
import { IWarehouse } from './IWarehouseInterface';

export interface IBarcode extends Document {
  code: string; 
  product: IProduct['_id']; // Référence à l'identifiant du produit associé
  warehouse: IWarehouse['_id']; // Référence à l'identifiant de warehouse associé
  creationDate: Date; 
}
