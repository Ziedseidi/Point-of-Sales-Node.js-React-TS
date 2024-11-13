import express from 'express';
import bandController from '../controllers/Brand.controller';
import uploadImage from '../midllewares/multer';

const router = express.Router();

router.post('/Addbrand', uploadImage.single('logoBrand'),bandController.addBrand);

router.get('/brands', bandController.getBrands);

router.get('/brands/:id', bandController.getBrandById);

router.patch('/Updatebrand/:id',uploadImage.single('logoBrand'), bandController.updateBrand);

router.delete('/Deletebrand/:id',bandController.deleteBrand);

export default router;
