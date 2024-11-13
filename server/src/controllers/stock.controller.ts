import { Request, Response } from 'express';
import { Stock } from '../models/Stock.model';


const stockController = {
  async addStock(req: Request, res: Response) {
    try {
      const stock = new Stock (req.body);
      await stock.save();
      res.status(201).json(stock);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async getStocks(req: Request, res: Response) {
    try {
      const stock = await Stock.find();
      res.status(200).json(stock);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  
  async getStockById(req: Request, res: Response) {
    try {
      const stock = await Stock.findById(req.params.id)
        
      if (!stock) return res.status(404).json({ message: 'stock not found' });
      res.status(200).json(stock);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async updateStock(req: Request, res: Response) {
    try {
      const stock = await Stock.findByIdAndUpdate(req.params.id, req.body, { new: true })
       
      if (!stock) return res.status(404).json({ message: 'stock not found' });
      res.status(200).json(stock);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async deleteStock(req: Request, res: Response) {
    try {
      const stock = await Stock.findByIdAndDelete(req.params.id);
      if (!stock) return res.status(404).json({ message: 'stock not found' });
      res.status(200).json({ message: 'stock deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export default stockController;
