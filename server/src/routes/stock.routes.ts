import express from 'express';
import stockController from '../controllers/stock.controller';

const router = express.Router();

router.post('/Addstock', stockController.addStock);

router.get('/Stocks', stockController.getStocks);

router.get('/Stocks/:id', stockController.getStockById);

router.put('/UpdateStocks/:id', stockController.updateStock);

router.delete('/DeleteStocks/:id', stockController.deleteStock);

export default router;
