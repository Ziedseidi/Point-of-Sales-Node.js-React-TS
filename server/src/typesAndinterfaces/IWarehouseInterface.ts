// src/typesAndinterfaces/IWarehouseInterface.ts

import { Types } from 'mongoose';

export interface IWarehouse {
  _id?: Types.ObjectId;
  name: string;
  emailwarehouse: string;
  phone: string;
  country: string;
  zipcode: string;
  city: string;
}
