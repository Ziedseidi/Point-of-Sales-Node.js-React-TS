import { Request, Response } from 'express';
import { Warehouse } from '../models/Warehouse.model';

const warehouseController = {
  // Fonction pour ajouter un entrepôt
  addwarehouse: async (req: Request, res: Response) => {
    try {
      const warehouse = new Warehouse(req.body);
      await warehouse.save();
      res.status(201).json(warehouse);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Fonction pour obtenir tous les entrepôts
  getWarehouses: async (req: Request, res: Response) => {
    try {
      const warehouses = await Warehouse.find();
      res.status(200).json(warehouses);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Fonction pour obtenir un entrepôt par ID
  getWarehouseById: async (req: Request, res: Response) => {
    try {
      const warehouse = await Warehouse.findById(req.params.id);
      if (!warehouse) return res.status(404).json({ message: 'Warehouse not found' });
      res.status(200).json(warehouse);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Fonction pour mettre à jour un entrepôt
  updateWarehouse: async (req: Request, res: Response) => {
    try {
      const warehouse = await Warehouse.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!warehouse) return res.status(404).json({ message: 'Warehouse not found' });
      res.status(200).json(warehouse);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Fonction pour supprimer un entrepôt
  deleteWarehouse: async (req: Request, res: Response) => {
    try {
      const warehouse = await Warehouse.findByIdAndDelete(req.params.id);
      if (!warehouse) return res.status(404).json({ message: 'Warehouse not found' });
      res.status(200).json({ message: 'Warehouse deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export default warehouseController;
