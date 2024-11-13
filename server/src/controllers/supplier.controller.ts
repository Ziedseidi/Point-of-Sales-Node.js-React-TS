import { Request, Response } from 'express';
import { Supplier } from '../models/supplier.model';


const supplierController = {
  async addSupplier(req: Request, res: Response) {
    try {
      const supplier = new Supplier(req.body);
      await supplier.save();
      res.status(201).json(supplier);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async getSuppliers(req: Request, res: Response) {
    try {
      const supplier = await Supplier.find();
      res.status(200).json(supplier);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  
  async getSupplierById(req: Request, res: Response) {
    try {
      const supplier = await Supplier.findById(req.params.id)
        
      if (!supplier) return res.status(404).json({ message: 'supplier not found' });
      res.status(200).json(supplier);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async updateSupplier(req: Request, res: Response) {
    try {
      const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true })
       
      if (!supplier) return res.status(404).json({ message: 'supplier not found' });
      res.status(200).json(supplier);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async deleteSupplier(req: Request, res: Response) {
    try {
      const supplier = await Supplier.findByIdAndDelete(req.params.id);
      if (!supplier) return res.status(404).json({ message: 'supplier not found' });
      res.status(200).json({ message: 'supplier deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export default supplierController;
