
import express from 'express';
import warehouseController from '../controllers/warhouse.controller';

const router = express.Router();

router.post('/Addwarehouse', warehouseController.addwarehouse);

router.get('/warehouses', warehouseController.getWarehouses);

router.get('/warehouses/:id', warehouseController.getWarehouseById);

router.put('/Updatewarehouses/:id', warehouseController.updateWarehouse);

router.delete('/Deletewarehouses/:id', warehouseController.deleteWarehouse);

export default router;
