import express from 'express';
import customerController from '../controllers/customer.controller';

const router = express.Router();

router.post('/Addcustomer', customerController.addCustomer);

router.get('/customers', customerController.getCustomers);

router.get('/customers/:id', customerController.getCustomerById);

router.put('/UpdateCustomers/:id', customerController.updateCustomer);

router.delete('/DeleteCustomers/:id', customerController.deleteCustomer);

export default router;
