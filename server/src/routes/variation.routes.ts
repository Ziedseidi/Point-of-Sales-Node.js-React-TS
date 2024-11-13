import express from 'express';
import variationController from '../controllers/Variation.controller';

const router = express.Router();

router.post('/Addvariation', variationController.addVariation);

router.get('/variations', variationController.getVariations);

router.get('/variations/:id', variationController.getVariationById);

router.put('/Updatevariations/:id', variationController.updateVariation);

router.delete('/Deletevariations/:id', variationController.deleteVariation);

export default router;
