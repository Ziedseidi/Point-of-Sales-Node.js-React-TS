import express from 'express';
import productCategoryController from '../controllers/productcategory.controller';
import uploadImage from '../midllewares/multer';

const router = express.Router();

router.post('/Addcategory', uploadImage.single('logoCategory'), productCategoryController.addProductCategory);

router.get('/categories', productCategoryController.getProductCategories);

router.get('/categories/:id', productCategoryController.getProductCategoryById);

router.put('/Updatecategory/:id', productCategoryController.updateProductCategory);

router.delete('/Deletecategory/:id', productCategoryController.deleteProductCategory);

export default router;
