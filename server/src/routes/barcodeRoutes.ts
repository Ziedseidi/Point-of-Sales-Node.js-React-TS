import express from 'express';
import barcodeMiddleware from '../midllewares/barcode';
import barcodeController from '../controllers/barecode.controller';

const router = express.Router();

// Route pour générer un code à barres
router.post('/generate', barcodeMiddleware);

// Route pour ajouter un code à barres
router.post('/assign-barecode', barcodeController.addBarcode);


export default router;
