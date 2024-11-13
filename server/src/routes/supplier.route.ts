import express from 'express';
import supplierController from '../controllers/supplier.controller';

const router = express.Router();

router.post('/Addsupplier', supplierController.addSupplier);

router.get('/Suppliers', supplierController.getSuppliers);

router.get('/Suppliers/:id', supplierController.getSupplierById);

router.put('/UpdateSuppliers/:id', supplierController.updateSupplier);

router.delete('/DeleteSuppliers/:id', supplierController.deleteSupplier);

export default router;
