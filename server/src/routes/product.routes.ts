import express from 'express';
import productController from '../controllers/product.controller';

const router = express.Router();

router.post('/Addproduct', productController.addProduct);

router.get('/products', productController.getProducts);

router.get('/products/:id', productController.getProductById);

router.put('/Updateproducts/:id', productController.updateProduct);

router.delete('/Deleteproducts/:id', productController.deleteProduct);

export default router;
