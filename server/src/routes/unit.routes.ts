import express from 'express';
import unitController from '../controllers/unit.controller';

const router = express.Router();

router.post('/Addunit', unitController.addUnit);
router.get('/units', unitController.getUnits);
router.get('/units/:id', unitController.getUnitById);
router.put('/Updateunits/:id', unitController.updateUnit);
router.delete('/Deleteunits/:id', unitController.deleteUnit);

export default router;
