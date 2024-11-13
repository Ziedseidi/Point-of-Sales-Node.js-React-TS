import { Request, Response } from 'express';
import { Unit } from '../models/Unit.model';

const unitController = {
  async addUnit(req: Request, res: Response) {
    try {
      const unit = new Unit(req.body);
      await unit.save();
      res.status(201).json(unit);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async getUnits(req: Request, res: Response) {
    try {
      const units = await Unit.find();
      res.status(200).json(units);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getUnitById(req: Request, res: Response) {
    try {
      const unit = await Unit.findById(req.params.id);
      if (!unit) return res.status(404).json({ message: 'Unit not found' });
      res.status(200).json(unit);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async updateUnit(req: Request, res: Response) {
    try {
      const unit = await Unit.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!unit) return res.status(404).json({ message: 'Unit not found' });
      res.status(200).json(unit);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async deleteUnit(req: Request, res: Response) {
    try {
      const unit = await Unit.findByIdAndDelete(req.params.id);
      if (!unit) return res.status(404).json({ message: 'Unit not found' });
      res.status(200).json({ message: 'Unit deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export default unitController;
